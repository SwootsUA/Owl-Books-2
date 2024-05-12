export async function isAuthorized() {
    const response = await fetch(`http://localhost:2210/protected`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    });
    
    if (response.ok) {
        // Convert the response body to JSON
        const responseData = await response.json();
        console.log(responseData);
    } else {
        // If response is not okay, handle the error
        console.error('Error:', response.statusText);
    }
}

export function userAuth() {
    window.location.href = "http://localhost:2210/auth/google";
}

export async function userLogOut() {
    await fetch('http://localhost:2210/logout');
}