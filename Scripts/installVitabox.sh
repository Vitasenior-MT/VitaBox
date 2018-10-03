#!/bin/bash

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
folderVitabox=$(pwd)/VitaBox
folderRoot=$(pwd)

before_reboot(){
	print_status "Install nodejs version 9."
	exec_cmd "curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -"

	print_status "Install all aplications."
	exec_cmd "sudo apt-get install -y chromium-browser xscreensaver cec-utils mongodb git unclutter bluetooth bluez libbluetooth-dev libudev-dev ffmpeg frei0r-plugins dos2unix nodejs network-manager"
}

after_reboot(){
	print_status "Install npm global models."
	exec_cmd "sudo npm install -g node-gyp"
	exec_cmd "sudo npm install -g node-pre-gyp"
	exec_cmd "sudo npm install -g cross-env"

	cd
	exec_cmd "sudo rm -rf ${folderVitabox}"

	print_status "Clone git repository VitaBox"
	exec_cmd "git clone https://github.com/nelsonmpg/VitaBox"

	print_status "Install node models VitaBox"
	exec_cmd "cd ${folderVitabox}/ && npm install"

	print_status "Install node models VitaBox - Interface"
	exec_cmd "cd ${folderVitabox}/public && npm install"

	print_status "Build VitaBox - Interface"
	exec_cmd "cd ${folderVitabox}/public && npm run build"

	print_bold \
	"                            VITASENIOR - VITABOX                           " "\
	${bold} Config scripts autostart ${normal}"

	exec_cmd "cd ${folderVitabox}/Scripts && sudo dos2unix ./*"
	exec_cmd "cd ${folderVitabox}/Scripts && sudo chmod +x *.sh || true"

	print_status "VitaBox - Node autostart"
	exec_cmd "sudo rm -rf /etc/systemd/system/nodeAutostart.service || true"

	exec_cmd "sed -i 's#FOLDERVITABOX#${folderVitabox}#g' ${folderVitabox}/Scripts/nodeAutostart.txt"
	exec_cmd "sudo cp ${folderVitabox}/Scripts/nodeAutostart.txt /etc/systemd/system/nodeAutostart.service"
	exec_cmd "sudo rm -rf ${folderVitabox}/Scripts/nodeAutostart.txt"

	exec_cmd "sudo systemctl enable nodeAutostart.service || true"
	exec_cmd "sudo systemctl start nodeAutostart.service || true"

	print_status "VitaBox - Chromium config and autostart"
	sudo echo "@sh ${folderVitabox}/Scripts/autoStartChrome.sh" >> ${folderRoot}/.config/lxsession/LXDE-pi/autostart
	sudo chmod +x autoStartChrome.sh

	print_status "VitaBox - sensors config and autostart"
	exec_cmd "cd ${folderRoot}"
	exec_cmd "git clone https://github.com/contiki-ng/contiki-ng.git"
	exec_cmd "git submodule init"
	exec_cmd "git submodule update"
	exec_cmd "make TARGET=zoul --directory contiki/examples/ipv6/rpl-border-router/ savetarget"
	exec_cmd "make --directory contiki/examples/ipv6/rpl-border-router/ border-router.upload && make --directory contiki/examples/ipv6/rpl-border-router/ connect-router"

	print_status "VitaBox - config rpi boot"
	exec_cmd "sudo rm -f /boot/config.txt || true"
	exec_cmd "sudo cp ${folderVitabox}/bootConfig.txt /boot/config.txt"

	print_status "VitaBox - hide mouse"
	exec_cmd "sudo sh mousehide.sh || true"

	print_status "VitaBox - disable Screen aver"
	exec_cmd "sudo sh xscreensaver.sh || true"

	print_bold \
	"                         VITASENIOR - VITABOX                         " "\
		${bold} This install complete.

	Autores: Nelson Gomes & Dário Jorge	  		"

	print_status "VitaBox - Restart System"
}

if [ -f /var/run/rebooting-for-updates ]; then
	after_reboot
	exec_cmd "sudo rm /var/run/rebooting-for-updates"
	exec_cmd "sudo update-rc.d InstallVitaBox remove"
	exec_cmd "sudo rm -rf /etc/init.d/InstallVitaBox"
	exec_cmd "sudo reboot"
else
	before_reboot
	exec_cmd "sudo cat $(pwd)/${0} > InstallVitaBox"
	exec_cmd "sudo chmod 755 $(pwd)/InstallVitaBox"
	exec_cmd "sudo mv $(pwd)/InstallVitaBox > /etc/init.d/InstallVitaBox"
	exec_cmd "sudo touch /var/run/rebooting-for-updates"
	exec_cmd "sudo update-rc.d InstallVitaBox defaults"
	exec_cmd "sudo reboot"
fi