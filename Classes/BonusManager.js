class BonusManager {
    constructor (settings) {
         this.bonusTypes = [
            {name: 'SuperSpeed', radius: 20, color: '#ffff00'},
            {name: 'IncreasePaddleSize', radius: 15, color: '#0000ff'}
        ];

        this.bonusArr = [];
        this.maxBonus = settings.maxBonus;
    }

    addRandomBonus(canvas) {
        if (this.bonusArr.length < this.maxBonus) {
            const bonusType = this.bonusTypes[Math.floor(Math.random() * (this.bonusTypes.length))]
    
            this.bonusArr.push(new Bonus(bonusType, canvas))
        }
    }

    collisionDetection(ball) {
        for(let i = 0; i < this.bonusArr.length; i++) {
            if (this.bonusArr[i].collisionDetection(ball)) {
                this.bonusEffect(this.bonusArr[i].name, ball);
                
                this.bonusArr.splice(i, 1);
                i--;
            }
        }
    }

    reset() {
        this.bonusArr = [];
    }

    draw(ctx) {
        this.bonusArr.forEach(bonus => {
            bonus.draw(ctx);
        })
    }

    bonusEffect(name, ball) {
        if (name === 'SuperSpeed') {
            ball.boost = true;
        }
        else if (name === 'IncreasePaddleSize') {
            
        }
    }
}