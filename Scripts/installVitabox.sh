#!/bin/sh

bail() {
	echo 'Error executing command, exiting'
	exit 1
}

exec_cmd_nobail() {
	echo "+ $1"
	bash -c "$1"
}

exec_cmd() {
	exec_cmd_nobail "$1" || bail
}


print_status() {
	if [ -f /etc/redhat-release ]; then
	  local outp=$(echo "$1") # | sed -r 's/\\n/\\n## /mg')
	  echo
	  echo -e "## ${outp}"
	  echo
	fi

	if [ -f /etc/lsb-release ]; then	  
		echo
		echo "## $1"
		echo
	fi

	if [ -f /etc/os-release ]; then	  
		echo
		echo "## $1"
		echo

	fi
}

if test -t 1; then # if terminal
    ncolors=$(which tput > /dev/null && tput colors) # supports color
    if test -n "$ncolors" && test $ncolors -ge 8; then
    	termcols=$(tput cols)
    	bold="$(tput bold)"
    	underline="$(tput smul)"
    	standout="$(tput smso)"
    	normal="$(tput sgr0)"
    	black="$(tput setaf 0)"
    	red="$(tput setaf 1)"
    	green="$(tput setaf 2)"
    	yellow="$(tput setaf 3)"
    	blue="$(tput setaf 4)"
    	magenta="$(tput setaf 5)"
    	cyan="$(tput setaf 6)"
    	white="$(tput setaf 7)"
    fi
fi

print_bold() {
	title="$1"
	text="$2"

	echo
	echo "${red}================================================================================${normal}"
	echo
	echo  "    	${bold}${yellow}${title}${normal}"
	echo
	echo  "  ${text}"
	echo
	echo "${red}================================================================================${normal}"
}

print_bold \
"                            VITASENIOR - VITABOX                           " "\
${bold} Install VITABOX ${normal}"

cd
folderRoot=$(pwd)
folderVitabox=${folderRoot}/VitaBox

before_reboot(){
	print_status "Install nodejs version 9."
	exec_cmd "curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -"

	print_status "Install all aplications."
	exec_cmd "sudo apt-get install -y chromium-browser cec-utils mongodb git unclutter bluetooth bluez libbluetooth-dev libudev-dev ffmpeg frei0r-plugins dos2unix nodejs network-manager"
	
	print_bold \
	"                         VITASENIOR - VITABOX                         " "\
		${bold} Wait this system restart.
	"
}

after_reboot(){
	print_status "Install npm global models."
	exec_cmd "sudo npm install -g node-gyp || true"
	exec_cmd "sudo npm install -g node-pre-gyp || true"
	exec_cmd "sudo npm install -g cross-env || true"

	cd
	exec_cmd "sudo rm -rf ${folderVitabox}"
	cd

	print_status "Clone git repository VitaBox"
	exec_cmd "git clone https://github.com/nelsonmpg/VitaBox"

	print_status "Install node models VitaBox"
	exec_cmd "cd ${folderVitabox}/ && npm install || true"

	print_bold \
	"                            VITASENIOR - VITABOX                           " "\
	${bold} Config scripts autostart ${normal}"

	exec_cmd "cd ${folderVitabox}/Scripts && sudo dos2unix ./*"
	exec_cmd "cd ${folderVitabox}/Scripts && sudo chmod +x *.sh || true"
	exec_cmd "mkdir ${folderVitabox}/ScriptsRun || true"
	exec_cmd "mkdir ${folderVitabox}/logs || true"

	print_status "VitaBox - Node autostart"
	exec_cmd "sudo rm -rf /etc/systemd/system/nodeAutostart.service || true"

	exec_cmd "cp ${folderVitabox}/Scripts/nodeAutostart.txt ${folderVitabox}/Scripts/nodeAutostart.txt.service"
	exec_cmd "sed -i 's#FOLDERVITABOX#${folderVitabox}#g' ${folderVitabox}/Scripts/nodeAutostart.txt.service"
	exec_cmd "sudo cp ${folderVitabox}/Scripts/nodeAutostart.txt.service /etc/systemd/system/nodeAutostart.service"
	exec_cmd "sudo rm -rf ${folderVitabox}/Scripts/nodeAutostart.txt.service"

	exec_cmd "sudo systemctl enable nodeAutostart.service || true"
	exec_cmd "sudo systemctl start nodeAutostart.service || true"

	print_status "VitaBox - Chromium config and autostart"
	exec_cmd "mkdir -p ${folderRoot}/.config/autostart && cat ${folderVitabox}/Scripts/autoStartChrome.desktop > ${folderRoot}/.config/autostart/autoStartChrome.desktop"
	
	print_status "VitaBox - sensors config and autostart"
	cd
	
	print_status "VitaBox - Border Router autostart"
	exec_cmd "sudo rm -rf /etc/systemd/system/borderRouter.service || true"

	exec_cmd "sudo rm -rf ${folderRoot}/contiki-ng"
	exec_cmd "cd ${folderRoot}"
	exec_cmd "git clone https://github.com/contiki-ng/contiki-ng.git"
	exec_cmd "cd ${folderRoot}/contiki-ng/ && git submodule init"
	exec_cmd "cd ${folderRoot}/contiki-ng/ && git submodule update"
	exec_cmd "cd ${folderRoot}/contiki-ng/ && make TARGET=zoul --directory examples/rpl-border-router/ savetarget || true"
	exec_cmd "cd ${folderRoot}/contiki-ng/ && make --directory examples/rpl-border-router/ border-router.upload && make --directory examples/rpl-border-router/ connect-router || true"
	
	exec_cmd "cp ${folderVitabox}/Scripts/borderRouter.txt ${folderVitabox}/Scripts/borderRouter.txt.service  || true"
	exec_cmd "sed -i 's#FOLDERVITABOX#${folderVitabox}#g' ${folderVitabox}/Scripts/borderRouter.txt.service  || true"
	exec_cmd "sudo cp ${folderVitabox}/Scripts/borderRouter.txt.service /etc/systemd/system/borderRouter.service  || true"
	exec_cmd "sudo rm -rf ${folderVitabox}/Scripts/borderRouter.txt.service || true"
	
	exec_cmd "sudo systemctl enable borderRouter.service || true"
	exec_cmd "sudo systemctl start borderRouter.service || true"

	exec_cmd "cp ${folderVitabox}/Scripts/borderRouterRun.txt ${folderVitabox}/ScriptsRun/borderRouterRun.sh || true"
	exec_cmd "sed -i 's#FOLDERVITABOX#${folderVitabox}#g' ${folderVitabox}/ScriptsRun/borderRouterRun.sh  || true"
	exec_cmd "sed -i 's#FOLDERROOT#${folderRoot}#g' ${folderVitabox}/ScriptsRun/borderRouterRun.sh  || true"
	exec_cmd "sudo chmod 755 ${folderVitabox}/ScriptsRun/borderRouterRun.sh || true"
	
	print_status "VitaBox - config rpi boot"
	exec_cmd "sudo rm -f /boot/config.txt || true"
	exec_cmd "sudo cp ${folderVitabox}/Scripts/bootConfig.txt /boot/config.txt"

	print_status "VitaBox - hide mouse"
	exec_cmd "cd ${folderVitabox}/Scripts && sudo sh mousehide.sh || true"

	print_status "VitaBox - disable Screen Saver and Black Screen"
	exec_cmd "cd ${folderVitabox}/ScriptsRun && cat /etc/lightdm/lightdm.conf >> ${folderVitabox}/ScriptsRun/Baklightdm.conf || true"
	exec_cmd "sudo mv /etc/lightdm/lightdm.conf /etc/lightdm/lightdm.conf.bak || true"
	exec_cmd "cd ${folderVitabox}/Scripts && cat screensaveroff.txt >> ${folderVitabox}/ScriptsRun/Baklightdm.conf || true"
	exec_cmd "sudo cp ${folderVitabox}/ScriptsRun/Baklightdm.conf /etc/lightdm/lightdm.conf || true"
	exec_cmd "sudo rm -rf ${folderVitabox}/ScriptsRun/Baklightdm.conf || true"

	print_status "VitaBox - Add auto run collect fitness band data."
	exec_cmd "crontab -l | grep -v '${folderVitabox}/ScriptsRun/autorunband.sh'  | crontab -"
	exec_cmd "cp ${folderVitabox}/Scripts/autorunband.txt ${folderVitabox}/ScriptsRun/autorunband.sh"
	exec_cmd "sed -i 's#FOLDERVITABOX#${folderVitabox}#g' ${folderVitabox}/ScriptsRun/autorunband.sh"
	exec_cmd "sudo chmod 755 ${folderVitabox}/ScriptsRun/autorunband.sh"
	exec_cmd "(crontab -l; echo '*/30 * * * * ${folderVitabox}/ScriptsRun/autorunband.sh') | crontab -"

	print_status "VitaBox - Check last GIT version and restart system."
	exec_cmd "crontab -l | grep -v '${folderVitabox}/ScriptsRun/syncVitabox.sh'  | crontab -"
	exec_cmd "cp ${folderVitabox}/Scripts/syncVitabox.txt ${folderVitabox}/ScriptsRun/syncVitabox.sh"
	exec_cmd "sed -i 's#FOLDERVITABOX#${folderVitabox}#g' ${folderVitabox}/ScriptsRun/syncVitabox.sh"
	exec_cmd "sudo chmod 755 ${folderVitabox}/ScriptsRun/syncVitabox.sh"
	exec_cmd "(crontab -l; echo '0 4 * * * ${folderVitabox}/ScriptsRun/syncVitabox.sh') | crontab -"

	print_bold \
	"                         VITASENIOR - VITABOX                         " "\
		${bold} This install complete.

	Autores: Nelson Gomes & Dário Jorge	  		
	
	VitaBox - Restart System"
}


if [ -f ${folderRoot}/.config/autostart/scriptcontinue.desktop ]; then
 	after_reboot
	print_status "Remove sctipt runs after reboot."
	exec_cmd "sudo rm -f ${folderRoot}/.config/autostart/scriptcontinue.desktop"
	print_status "System Reboot"
	print_status "Wait ... 10s"
	sleep 10
	exec_cmd "sudo reboot"
else
	before_reboot
	exec_cmd "sudo chmod 755 ${folderRoot}/${0}"
	print_status "Create Job to run after reboot."
	exec_cmd "mkdir -p ${folderRoot}/.config/autostart || true"
	echo "[Desktop Entry]" > ${folderRoot}/.config/autostart/scriptcontinue.desktop
	echo "Name=StartApp Script Continue" >> ${folderRoot}/.config/autostart/scriptcontinue.desktop
	echo "Exec=lxterminal --command \"${folderRoot}/${0}\"" >> ${folderRoot}/.config/autostart/scriptcontinue.desktop
	echo "Type=Application" >> ${folderRoot}/.config/autostart/scriptcontinue.desktop
	echo "Terminal=true" >> ${folderRoot}/.config/autostart/scriptcontinue.desktop
	print_status "Wait ... 10s"
	sleep 10
	exec_cmd "sudo reboot"
fi