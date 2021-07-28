// Window on Loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        await fetch('/');   //AJAX via fetch() API
    } catch (e) {
        console.log("Error: ", e);
    }
});
