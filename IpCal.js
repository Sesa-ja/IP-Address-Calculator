document.getElementById('findButton').addEventListener('click', function() {
    const ipAddress = document.getElementById('ipAddress').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const resultsSection = document.getElementById('resultsSection');
    const results = {
        ip: document.getElementById('ip'),
        binary: document.getElementById('binary'),
        subnet: document.getElementById('subnet'),
        net: document.getElementById('net'),
        host: document.getElementById('host'),
        class: document.getElementById('class')
    };

    if (validateIP(ipAddress)) {
        errorMessage.style.display = 'none';
        displayResults(ipAddress, results);
        resultsSection.style.display = 'block';
    } else {
        errorMessage.style.display = 'block';
        resultsSection.style.display = 'none';
        clearResults(results);
    }
});

document.querySelector('button[type="reset"]').addEventListener('click', function() {
    const resultsSection = document.getElementById('resultsSection');
    const results = {
        ip: document.getElementById('ip'),
        binary: document.getElementById('binary'),
        subnet: document.getElementById('subnet'),
        net: document.getElementById('net'),
        host: document.getElementById('host'),
        class: document.getElementById('class')
    };
    clearResults(results);
    resultsSection.style.display = 'none';
    document.getElementById('errorMessage').style.display = 'none';
});

function validateIP(ip) {
    const regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
    return regex.test(ip);
}

function displayResults(ip, results) {
    const binary = ip.split('.').map(num => parseInt(num, 10).toString(2).padStart(8, '0')).join('.');
    const subnet = getSubnetMask(ip);
    const netID = getNetID(ip, subnet);
    const hostID = getHostID(ip, subnet);
    const ipClass = getClass(ip);

    results.ip.textContent = ip;
    results.binary.textContent = binary;
    results.subnet.textContent = subnet;
    results.net.textContent = netID;
    results.host.textContent = hostID;
    results.class.textContent = ipClass;
}

function getSubnetMask(ip) {
    const firstOctet = parseInt(ip.split('.')[0], 10);
    if (firstOctet >= 1 && firstOctet <= 126) return '255.0.0.0';
    if (firstOctet >= 128 && firstOctet <= 191) return '255.255.0.0';
    if (firstOctet >= 192 && firstOctet <= 223) return '255.255.255.0';
    if (firstOctet >= 224 && firstOctet <= 239) return '255.0.0.0';
    if (firstOctet >= 240 && firstOctet <= 255) return '255.0.0.0';
    return 'Unknown';
}

function getNetID(ip, subnet) {
    const ipParts = ip.split('.');
    const subnetParts = subnet.split('.');
    return ipParts.map((part, i) => part & subnetParts[i]).join('.');
}

function getHostID(ip, subnet) {
    const ipParts = ip.split('.');
    const subnetParts = subnet.split('.');
    return ipParts.map((part, i) => part & ~subnetParts[i]).join('.');
}

function getClass(ip) {
    const firstOctet = parseInt(ip.split('.')[0], 10);
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E';
    return 'Unknown';
}

function clearResults(results) {
    for (let key in results) {
        results[key].textContent = '';
    }
}


