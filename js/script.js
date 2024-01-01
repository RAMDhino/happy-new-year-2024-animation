window.onload = () => {
    // Canvas Setup
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    let canvasHeight = canvas.getAttribute("height");
    let canvasWidth = canvas.getAttribute("width");

    let undergroundPoint = canvasHeight;

    // Fireworks Setup
    let fireworks = [];
    let x = 0;
    let y = canvasHeight;
    const r = 3;
    const speed = 5;
    const fireworksCount = 5;

    // Particles Setup
    let particles = [];

    // "Nature" Setup
    const gravity = 0.005;
    const friction = 0.99;

    // Helper Tools
    let getStartPoint = () => {
        const leftLimitPoint = canvasWidth - (canvasWidth * (1 - 0.125));
        const rightLimitPoint = canvasWidth - (canvasWidth * 0.125);

        let step1 = leftLimitPoint - rightLimitPoint + 1;
        let step2 = Math.random() * step1;
        let res = Math.floor(step2) + rightLimitPoint;
        return res;
    }

    let getRandomBlownPoint = () => {
        const maxPoint = canvasHeight * 0.125;
        const minPoint = canvasHeight * (2 / 3);

        let step1 = maxPoint - minPoint + 1;
        let step2 = Math.random() * step1;
        let res = Math.floor(step2) + minPoint;
        return res;
    }

    let getRandomHexColor = () => {
        let hexElements = "123456789A";
        let hexColor = "#";
        for (let i = 0; i < 6; i++) {
            hexColor += hexElements[Math.floor(Math.random() * 10)];
        }
        return hexColor;
    }


    // Fireworks Prototype
    class Fireworks {
        constructor(x, y, color, blownPoint, isBlown) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.blownPoint = blownPoint;
            this.isBlown = isBlown;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y + 7, r * 0.75, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y + 13, r * 0.5, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        fly() {
            if (this.y >= this.blownPoint) {
                this.draw();
                this.y -= speed;
            } else {
                this.blown();
                this.y = undergroundPoint;
                this.x = getStartPoint();
                this.color = getRandomHexColor();
            }
        }

        blown() {
            const particlesCount = 360;
            const angleIncrement = (Math.PI * 2) / particlesCount;
            const power = 5;

            for (let i = 0; i < particlesCount; i++) {
                particles.push(
                    new Particle(this.x, this.y, this.color, {
                        x: Math.cos(angleIncrement * i) * Math.random() * power,
                        y: Math.sin(angleIncrement * i) * Math.random() * power
                    })
                );
            }
        }
    };

    // Particles Prototype
    class Particle {
        constructor(x, y, color, velocity) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = velocity;
            this.alpha = 1;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r * 0.75, 0, 2 * Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
            ctx.restore();
        }

        show() {
            this.draw();
            this.velocity.x *= friction;
            this.velocity.y *= friction;
            this.velocity.y += gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= 0.005;
        }
    }

    // Let's Go!
    // HAPPY NEW YEAR 2024!
    for (let i = 0; i < fireworksCount; i++) {
        fireworks[i] = new Fireworks(getStartPoint(), undergroundPoint, getRandomHexColor(), getRandomBlownPoint());
        setInterval(() => {
            fireworks[i].fly();
        }, 500);
    }

    let end2023 = () => {
        console.log("Bye 2023!");
    }

    let start2024 = () => {
        requestAnimationFrame(start2024);

        ctx.fillStyle = 'rgba(6, 4, 6, 0.1)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < fireworksCount; i++) {
            fireworks[i].fly();
        }

        particles.forEach((particle, i) => {
            if (particle.alpha > 0) {
                particle.show();
            }
        });
    }
    
    end2023();
    start2024();
};