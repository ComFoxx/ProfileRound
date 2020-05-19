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

    elementWidth = null
    elementHeight = null

    /**
     * 
     * @param {Object} options
     * @param {number} position
     * @param {boolean} isMe
     * @param {number} radiusPercent
     * @param {boolean} visible
     */
    constructor (options = {}, position = NaN, isMe = false, radiusPercent = 45, visible = false) {
        this.options = options
        this.position = position
        this.isMe = isMe
        this.radiusPercent = radiusPercent
        this.visible = visible
        this.element = this.createElement(options)
        if (!this.visible) this.element.classList.add('invisible')
    }

    /**
     * 
     * @param {Object} options
     * @returns {HTMLElement}
     */
    createElement (options) {}

    setDimensions () {
        const bbox = this.element.getBoundingClientRect()
        this.elementWidth = bbox.width
        this.elementHeight = bbox.height
    }

    /**
     * 
     * @param {number} steps
     */
    setMove (targetAngle, steps) {
        this.targetAngle = targetAngle
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
    anime (callback = () => {}, keep = false) {
        this.element.style.position = 'absolute'
        if (this.elementWidth === null) this.setDimensions()
        this.animationCallback = callback
        if (!this.animated || keep) {
            this.animated = true
            this.currentAngle += this.angleAdd
            if (this.added) {
                this.currentAngle = this.targetAngle
                this.added = false
            }
            
            this.element.style.left = `calc(${this.radiusPercent * Math.sin(this.currentAngle) + 50}% - ${this.elementWidth / 2}px)`
            this.element.style.top =  `calc(${this.radiusPercent * Math.cos(this.currentAngle) + 50}% - ${this.elementHeight / 2}px)`
            
            if ((this.sens ? this.currentAngle > this.targetAngle : this.currentAngle < this.targetAngle) && this.angleAdd !== 0) requestAnimationFrame(() => this.anime(this.animationCallback, true))
            else {
                this.animated = false
                this.animationCallback()
            }
        }
    }

}
