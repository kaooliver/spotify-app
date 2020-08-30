import React, { useState, useEffect, Component, useRef } from 'react';

function Data () {

    var client_id = '3730a8b0eaba462a923037359da2226b'; // Your client id
    var client_secret = '088c3bc0b1034f5ba5af7229a2cc5181'; // Your secret
    var redirect_uri = 'http://localhost:3000/'; // Your redirect uri
    
    async function getAuth(url = 'https://accounts.spotify.com/authorize?client_id=3730a8b0eaba462a923037359da2226bresponse_type=code&redirect_uri=http://localhost:3000/&scope=user-read-private%20user-read-email&state=34fFs29kd09', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : '088c3bc0b1034f5ba5af7229a2cc5181',
            'Access-Control-Allow-Origin': '*'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'React Hooks POST Request Example' })
    };

    useEffect(() => {
        getAuth()
    },[])
    return  (
        <div>
            <h1>This is so hard</h1>
        </div>
    );
}

export default (Data)