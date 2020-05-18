export default class Profile {

    /**
     * @type {number}
     */
    currentAngle = 0

    /**
     * @type {number}
     */
    targetAngle = 0

    /**
     * @type {number}
     */
    angleAdd = 0

    /**
     * @type {boolean}
     */
    animated = false

    /**
     * @type {boolean}
     */
    sens = false

    /**
     * @type {boolean}
     */
    added = true

    /**
     * @type {Function}
     */
    animationCallback = () => {}

    /**
     * 
     * @param {Object} options
     * @param {boolean} visible
     * @param {number} position
     */
    constructor (options = {}, position = NaN, isMe = false, visible = false) {
        this.options = options
        this.position = position
        this.isMe = isMe
        this.visible = visible
        this.profileDiameter = '50px'
        this.element = this.createElement(options)
        if (!this.visible) this.element.classList.add('invisible')
    }

    /**
     * 
     * @param {Object} options
     * @returns {HTMLElement}
     */
    createElement (options) {}

    /**
     * 
     * @param {number} steps
     */
    setAngleAdd (steps) {
        this.angleAdd = ((this.targetAngle - this.currentAngle) / steps) * (1+Math.pow(10, -7))
        this.sens = this.currentAngle > this.targetAngle
    }

    /**
     * 
     * @param {number} duration
     * @param {function} callback
     */
    show (duration, callback = () => {}) {
        if (!this.visible) {
            const animation = this.element.animate([{
                opacity: 0,
                transform: 'translateX(' + (100 * Math.sin(this.currentAngle)) + '%) translateY(' + (100 * Math.cos(this.currentAngle)) + '%)'
            }, {
                opacity: 1,
                transform: 'translateX(0) translateY(0)'
            }], {
                duration: duration
            })
            this.visible = true
            this.element.classList.remove('invisible')
            animation.onfinish = callback
        } else {
            callback()
        }
    }

    /**
     * 
     * @param {number} duration
     * @param {function} callback
     */
    hide (duration, callback = () => {}) {
        if (this.visible) {
            const animation = this.element.animate([{
                opacity: 1,
                transform: 'translateX(0) translateY(0)'
            }, {
                opacity: 0,
                transform: 'translateX(' + (100 * Math.sin(this.currentAngle)) + '%) translateY(' + (100 * Math.cos(this.currentAngle)) + '%)'
            }], {
                duration: duration
            })
            this.visible = false
            this.element.classList.add('invisible')
            animation.onfinish = callback
        } else {
            callback()
        }
    }

    /**
     * 
     * @param {function} callback
     * @param {boolean} keep
     */
    anime (callback, keep = false) {
        this.animationCallback = callback
        if (!this.animated || keep) {
            this.animated = true
            this.currentAngle += this.angleAdd
            if (this.added) {
                this.currentAngle = this.targetAngle
                this.added = false
            }
            
            this.element.style.position = 'absolute'
            this.element.style.left = 'calc((45% *' + Math.sin(this.currentAngle) + ') + 50% - (' + this.profileDiameter + ' / 2))'
            this.element.style.top =  'calc((45% *' + Math.cos(this.currentAngle) + ') + 50% - (' + this.profileDiameter + ' / 2))'
            
            if ((this.sens ? this.currentAngle > this.targetAngle : this.currentAngle < this.targetAngle) && this.angleAdd !== 0) requestAnimationFrame(() => this.anime(this.animationCallback, true))
            else {
                this.animated = false
                this.animationCallback()
            }
        }
    }

}
