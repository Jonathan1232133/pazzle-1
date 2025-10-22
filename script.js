const correctCode = ['3', '7', '9', '2'];
const inputs = document.querySelectorAll('.digit');
const lockBody = document.querySelector('.lock-body');
const sounds = [
    document.getElementById('sound1'),
    document.getElementById('sound2'),
    document.getElementById('sound3'),
    document.getElementById('sound4')
];
const soundUnlocked = document.getElementById('soundUnlocked');

inputs[0].focus();

inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        
        if (e.target.value.length === 1) {
            // Воспроизвести звук при вводе
            playSound(sounds[index]);
            
            if (index < inputs.length - 1) {
                inputs[index + 1].focus();
            } else {
                checkCode();
            }
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !input.value && index > 0) {
            inputs[index - 1].focus();
        }

        if (e.key === 'Enter') {
            checkCode();
        }

        if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            inputs[index - 1].focus();
        }

        if (e.key === 'ArrowDown' && index < inputs.length - 1) {
            e.preventDefault();
            inputs[index + 1].focus();
        }
    });

    input.addEventListener('focus', (e) => {
        e.target.select();
    });
});

function playSound(audioElement) {
    if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play().catch(err => console.log('Audio play failed:', err));
    }
}

function checkCode() {
    const enteredCode = Array.from(inputs).map(input => input.value);
    
    if (enteredCode.every(digit => digit)) {
        if (JSON.stringify(enteredCode) === JSON.stringify(correctCode)) {
            // Правильный код - воспроизвести звук разблокировки
            playSound(soundUnlocked);
            
            document.body.classList.add('unlocked');
            
            // Отправить сообщение в Unity
                    PortalsSdk.sendMessageToUnity(JSON.stringify({
                        TaskName: "lock",
                        TaskTargetState: "SetNotActiveToActive"
                    }));
                    
                    PortalsSdk.closeIframe();
            
        } else {
            // Неправильный код - красная вспышка
            document.body.classList.add('error');
            lockBody.classList.add('error');
            inputs.forEach(input => input.classList.add('error'));
            
            setTimeout(() => {
                document.body.classList.remove('error');
                lockBody.classList.remove('error');
                inputs.forEach(input => {
                    input.classList.remove('error');
                    input.value = '';
                });
                inputs[0].focus();
            }, 500);
        }
    }
}
