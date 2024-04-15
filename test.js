const postData = async () => {
    const url = 'https://traodoisub.com/mua/fanpage/themid.php    ';
    const data = new URLSearchParams();
    data.append('maghinho', '');
    data.append('id', '61555169995847');
    data.append('sl', 50)
    data.append('dateTime', '2024-3-17 18:10:40')

    const myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json, text/javascript, */*; q=0.01');
    myHeaders.append('Accept-Encoding', 'gzip, deflate, br, zstd');
    myHeaders.append('Accept-Language', 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5');
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    myHeaders.append('Origin', 'https://traodoisub.com');
    myHeaders.append('Referer', 'https://traodoisub.com/mua/fanpage/');
    myHeaders.append('Sec-Ch-Ua', '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"');
    myHeaders.append('Sec-Ch-Ua-Mobile', '?0');
    myHeaders.append('Sec-Ch-Ua-Platform', '"Windows"');
    myHeaders.append('Sec-Fetch-Dest', 'empty');
    myHeaders.append('Sec-Fetch-Mode', 'cors');
    myHeaders.append('Sec-Fetch-Site', 'same-origin');
    myHeaders.append('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
    myHeaders.append('X-Requested-With', 'XMLHttpRequest');

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: data,
        redirect: "follow"
    };

    const promises = Array(20).fill().map(() => {
        return fetch(url, requestOptions)
            .then((response) => response.text())
            .catch((error) => console.error(error));
    });
    console.log("Test promise", promises);
    try {
        const responses = await Promise.all(promises);
        console.log(responses);
    } catch (error) {
        console.error(error);
    }
};

console.log("Start sending requests...");
postData()
    .then(() => console.log("All requests sent!"))
    .catch((error) => console.error("Error:", error));
