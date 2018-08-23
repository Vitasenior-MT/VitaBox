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

print_status "Install nodejs version 9."
exec_cmd "curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -"

print_status "Install all aplications."
exec_cmd "sudo apt-get install -y chromium-browser xscreensaver cec-utils mongodb git unclutter bluetooth bluez libbluetooth-dev libudev-dev ffmpeg frei0r-plugins dos2unix nodejs"

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
print_status "VitaBox - Node autostart"

echo "[Unit]"\
"Description=VitaBox" \
"#Requires=After=mongod.service       # Requires the mongo service to run first"\
""\
"[Service]"\
"Environment=NODE_ENV=PROD"\
"ExecStart=/usr/bin/node ${folderVitabox}/main.js"\
"#ExecStart=/usr/bin/npm run prod ${folderVitabox}/main.js"\
"##Required on some systems"\
"WorkingDirectory=${folderVitabox}"\
"Restart=always"\
"##Restart service after 10 seconds if node service crashes"\
"RestartSec=10"\
"StandardOutput=syslog"\
"StandardError=syslog"\
"SyslogIdentifier=VitaBox"\
""\
"[Install]"\
"WantedBy=multi-user.target" > /etc/systemd/system/nodeAutostart.service
exec_cmd "sudo systemctl enable nodeAutostart.service"
exec_cmd "sudo systemctl start nodeAutostart.service"

print_status "VitaBox - Chromium config and autostart"
sudo echo "@sh ${folderVitabox}/Scripts/autoStartChrome.sh" >> /home/pi/.config/lxsession/LXDE-pi/autostart
sudo chmod +x autoStartChrome.sh

print_status "VitaBox - sensors config and autostart"
exec_cmd "cd ${folderVitabox} && cd .."
exec_cmd "git clone https://github.com/contiki-ng/contiki-ng.git"
exec_cmd "git submodule init"
exec_cmd "git submodule update"
exec_cmd "make TARGET=zoul --directory contiki/examples/ipv6/rpl-border-router/ savetarget"
exec_cmd "make --directory contiki/examples/ipv6/rpl-border-router/ border-router.upload && make --directory contiki/examples/ipv6/rpl-border-router/ connect-router"

print_status "VitaBox - config rpi boot"
exec_cmd "sudo rm -f /boot/config.txt || true"
exec_cmd "sudo cp ${folderVitabox}/bootConfig.txt /boot/config.txt"

print_status "VitaBox - hide mouse"
exec_cmd "sudo chmod +x mousehide.sh || true"

print_bold \
"                         VITASENIOR - VITABOX                         " "\
	${bold} This install complete.

Autores: Nelson Gomes & Dário Jorge	  		"

print_status "VitaBox - Restart System"
exec_cmd "sudo reboot"

exit 0