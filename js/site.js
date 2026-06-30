document.addEventListener('contextmenu', function(event){
    event.preventDefault();
});

document.addEventListener('copy', function(event){
    event.preventDefault();
});

document.addEventListener('cut', function(event){
    event.preventDefault();
});

document.addEventListener('selectstart', function(event){
    if(event.target.matches('input, textarea')) return;
    event.preventDefault();
});

let lastTouchEnd = 0;

document.addEventListener('touchend', function(event){
    const now = Date.now();

    if(now - lastTouchEnd <= 300){
        event.preventDefault();
    }

    lastTouchEnd = now;
}, { passive:false });
