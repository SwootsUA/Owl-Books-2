export async function isAuthorized() {
    const response = await fetch(`http://localhost:2210/protected`, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include'
    });
    console.log(response);
}

export function userAuth() {
    window.location.href = "http://localhost:2210/auth/google";
}

export async function userLogOut() {
    await fetch('http://localhost:2210/logout');
}