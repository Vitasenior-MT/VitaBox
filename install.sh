#---------------------------------- NG
sudo apt-get update

sudo apt-get install -y chromium-browser xscreensaver cec-utils mongodb git unclutter bluetooth bluez libbluetooth-dev libudev-dev

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

#-------------------------------------
#1. Install nodejs
wget https://nodejs.org/dist/v8.9.2/node-v8.9.2-linux-armv6l.tar.gz
sudo tar -xzf node-v8.9.2-linux-armv6l.tar.gz
sudo cp -rf node-v8.9.2-linux-armv6l /opt/nodejs
sudo rm -f node-v8.9.2-linux-armv6l.tar.gz
sudo rm -rf node-v8.9.2-linux-armv6l
sudo rm -f /usr/bin/node
sudo rm -f /usr/bin/npm
sudo ln -s /opt/nodejs/bin/node /usr/bin/node
sudo ln -s /opt/nodejs/bin/npm /usr/bin/npm

#2. Config autostart
sudo cp nodeAutostart.service /etc/systemd/system/nodeAutostart.service
sudo systemctl enable nodeAutostart.service
sudo systemctl start nodeAutostart.service
#sudo systemctl stop nodeAutostart.service

#3. Chromium config and autostart
sudo echo "@sh /home/pi/Desktop/VitaBox/autoStartChrome.sh" >> /home/pi/.config/lxsession/LXDE-pi/autostart
sudo sed -i -e 's/\r$//' autoStartChrome.sh
sudo chmod +x autoStartChrome.sh

#3. sensors config and autostart
git clone https://github.com/contiki-os/contiki.git
make TARGET=zoul --directory /home/pi/contiki/examples/ipv6/rpl-border-router/ savetarget
make --directory /home/pi/contiki/examples/ipv6/rpl-border-router/ border-router.upload && make --directory /home/pi/contiki/examples/ipv6/rpl-border-router/ connect-router

#3. config rpi boot
sudo rm -f /boot/config.txt
sudo cp bootConfig.txt /boot/config.txt

#5. Installers
npm install
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install chromium-browser
sudo apt-get install xscreensaver
sudo apt-get install cec-utils
sudo apt-get install mongodb
sudo reboot
