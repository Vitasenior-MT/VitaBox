#---------------------------------- NG
sudo apt-get update

sudo apt-get install -y chromium-browser xscreensaver cec-utils mongodb git unclutter bluetooth bluez libbluetooth-dev libudev-dev ffmpeg frei0r-plugins

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g node-gyp
sudo npm install -g node-pre-gyp

git clone https://github.com/nelsonmpg/VitaBox
cd
cd VitaBox
npm install
cd public
#sudo rm -rf package-lock.json
#npm install
#npm run build
#-------------------------------------


#1. Install nodejs
#não testado
curl -sL https://deb.nodesource.com/setup_8.9.2 | sudo -E bash -
sudo apt-get install -y nodejs

#2. Config autostart
sudo cp nodeAutostart.service /etc/systemd/system/nodeAutostart.service
sudo systemctl enable nodeAutostart.service
sudo systemctl start nodeAutostart.service
#sudo systemctl stop nodeAutostart.service

#3. Chromium config and autostart
sudo echo "@sh /home/pi/Desktop/VitaBox/autoStartChrome.sh" >> /home/pi/.config/lxsession/LXDE-pi/autostart
sudo sed -i -e 's/\r$//' autoStartChrome.sh
sudo chmod +x autoStartChrome.sh

#4. sensors config and autostart
git clone https://github.com/contiki-os/contiki.git
make TARGET=zoul --directory contiki/examples/ipv6/rpl-border-router/ savetarget
make --directory contiki/examples/ipv6/rpl-border-router/ border-router.upload && make --directory contiki/examples/ipv6/rpl-border-router/ connect-router

#5. config rpi boot
sudo rm -f /boot/config.txt
sudo cp bootConfig.txt /boot/config.txt

#6. hide mouse
#não testado
sudo apt-get install unclutter
sudo sed -i -e 's/\r$//' mousehide.sh
sudo chmod +x mousehide.sh

#7. sceen saver
#não testado
sudo sed -i -e 's/\r$//' xscreensaver.sh
sudo chmod +x xscreensaver.sh

#7. Installers
npm install
sudo apt-get install chromium-browser
sudo apt-get install cec-utils
sudo apt-get install mongodb
sudo reboot
