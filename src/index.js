const request = require('request');
const cheerio = require('cheerio');
const UserAgent = require('user-agents');

exports.generateProxy = async () => {
    let ip_addresses = [];
    let port_numbers = [];
    let proxy;

    return new Promise((resolve, reject) => request("https://sslproxies.org/", (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);

            $("td:nth-child(1)").each(function(index, value) {
                ip_addresses[index] = $(this).text();
            });

            $("td:nth-child(2)").each(function(index, value) {
                port_numbers[index] = $(this).text();
            });
        } else {
            return reject("Error loading proxy, please try again");
        }

        ip_addresses.join(", ");
        port_numbers.join(", ");

        let random_number = Math.floor(Math.random() * 100);
        proxy = {
            host: ip_addresses[random_number],
            port: port_numbers[random_number],
            url: `http://${ip_addresses[random_number]}:${port_numbers[random_number]}`,
        };

        const userAgent = new UserAgent({ deviceCategory: 'desktop' }).userAgent;
        proxy.userAgent = userAgent

        return resolve(proxy)
    }));
}