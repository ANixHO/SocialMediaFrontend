import imageCompression from 'browser-image-compression';
import axios from "axios";

export async function compressImage(file) {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
    };

    try {
        return await imageCompression(file, options);
    } catch (error) {
        console.error('Error compressing image:', error);
        return file;  // Return original file if compression fails
    }
}

export function isUsernameAndPasswordValid(username, password) {

    if (!username || !password) {
        return [false, 'Please enter both username and password'];
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return [false, 'Username can only contain letters, numbers, and underscores'];
    } else if (!/^[a-zA-Z0-9!#.&*_+-]+$/.test(password)) {
        return [false, 'Password can only contain letters, numbers, and special characters !@#$%^&*()_+=-'];
    } else {
        return [true, 'valid']
    }
}
export function isUsernameValid(username) {

    if (!username  ) {
        return [false, 'Please enter both username and password'];
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return [false, 'Username can only contain letters, numbers, and underscores'];
    }  else {
        return [true, 'valid']
    }
}

export function isPasswordValid( password) {

    if (!password) {
        return [false, 'Please enter both username and password'];
    }  else if (!/^[a-zA-Z0-9!#.&*_+-]+$/.test(password)) {
        return [false, 'Password can only contain letters, numbers, and special characters !@#$%^&*()_+=-'];
    } else {
        return [true, 'valid']
    }
}

export function isPasswordSame(password_1, password_2) {
    let f = password_1 === password_2;
    return [f, 'Two passwords are not same'];
}

export function saveUserInfoToLocalStorage(loginData) {

    localStorage.setItem('jwt', loginData.jwt);
    localStorage.setItem('id', loginData.id);
    localStorage.setItem('username', loginData.username);
}

export async function validateJwtToken() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        try {

            const response = await axios.get('http://localhost:8080/api/auth/validateToken', {
                headers: {'Authorization': 'Bearer ' + jwt}
            });
            if (response.status === 200) {
                return true;
            }
        } catch (error) {
            console.log('Invalid jwt: ' + error)
            localStorage.clear();
            return false;
        }

    }
    return false;
}

export function base64ToBlob(base64Data) {
    let binarystr = atob(base64Data);
    let bytes = new Uint8Array(binarystr.length);
    for (let i = 0; i < binarystr.length; i++) {
        bytes[i] = binarystr.charCodeAt(i);

    }
    return new Blob([bytes], {type: 'image/png'});

}

export function storedImageUrl(binaryData) {
    const blob = base64ToBlob(binaryData);
    return URL.createObjectURL(blob);
}

export function userInputEncoder(userInput) {
    const trimmed = userInput.trim().replace(/\s+/g, ' ');
    return encodeURIComponent(trimmed);
}