Vagrant.configure("2") do |config|

  	config.vm.provider :virtualbox do |p|
    	p.customize ["modifyvm", :id, "--memory", "2048", "--cpus", "4", "--ioapic", "on"]
	end

  	config.vm.box = "ubuntu/trusty64"
	config.vm.provision "ansible" do |ansible|
    	ansible.playbook = "vagrant/ansible/site.yml"
  	end

	# mongodb
	config.vm.network :forwarded_port, host: 27017, guest: 27017

	config.vm.network "private_network", ip: "10.10.10.10"
	config.vm.synced_folder ".", "/vagrant", type: "nfs"
end
