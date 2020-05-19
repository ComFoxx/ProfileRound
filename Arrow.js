export default class Arrow {

    /**
     * Current angle value
     * 
     * @type {number}
     */
    currentAngle = 0

    /**
     * Target angle value
     * 
     * @type {number}
     */
    targetAngle = 0

    /**
     * Value add to current angle for each animation frame
     * 
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
     * @type {Function}
     */
    animationCallback = () => {}

    elementWidth = null
    elementHeight = null

    /**
     * Create new Arrow object
     * 
     * @param {Object} options Options object passed to the createElement function
     * @param {number} radiusPercent The radius of the round in percent
     * @param {boolean} visible Is the profile visible
     */
    constructor (options = {}, radiusPercent = 30, visible = false) {
        this.options = options
        this.radiusPercent = radiusPercent
        this.visible = visible
        this.element = this.createElement(options)
        if (!this.visible) this.element.classList.add('invisible')
    }

    /**
     * Return the element corresponding to the Arrow, must be modified by extending this class
     * 
     * @param {Object} options Options object passed by the constructor
     * @returns {HTMLElement}
     */
    createElement (options) {}

    /**
     * Set the elementWidth and elementHeight using the bounding client rect of the element
     */
    setDimensions () {
        const bbox = this.element.getBoundingClientRect()
        this.elementWidth = bbox.width
        this.elementHeight = bbox.height
    }

    /**
     * Set the angles for the animation
     * 
     * @param {number} targetAngle Angle targeted by the animation
     * @param {number} steps Number of animation frame before reaching the targeted angle
     */
    setMove (targetAngle, steps) {
        this.targetAngle = targetAngle
        if (this.currentAngle - this.targetAngle > Math.PI) this.targetAngle += Math.PI*2
        this.angleAdd = ((this.targetAngle - this.currentAngle) / steps) * (1+Math.pow(10, -7))
        this.sens = this.currentAngle > this.targetAngle
    }

    /**
     * Animate the arrow to make it visible (if it is not)
     * 
     * @param {number} duration Duration in ms for the animation
     * @param {function} callback Function called at animation's end
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
     * Animate the arrow to make it invisible (if it is not)
     * 
     * @param {number} duration Duration in ms for the animation
     * @param {function} callback Function called at animation's end
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
     * Animate position of the arrow using the angles
     * 
     * @param {function} callback Function called at animation's end
     * @param {boolean} keep Keep the function executing even if the animation is already in play (used for the animation frame)
     */
    anime (callback = () => {}, keep = false) {
        this.element.style.position = 'absolute'
        if (this.elementWidth === null) this.setDimensions()
        this.animationCallback = callback
        if (!this.animated || keep) {
            this.animated = true
            this.currentAngle += this.angleAdd

            this.element.style.left = `calc(${this.radiusPercent * Math.sin(this.currentAngle) + 50}% - ${this.elementWidth / 2}px)`
            this.element.style.top = `calc(${this.radiusPercent * Math.cos(this.currentAngle) + 50}% - ${this.elementHeight / 2}px)`
            this.element.style.transform = `rotate(-${this.currentAngle}rad)`
            
            if ((this.sens ? this.currentAngle > this.targetAngle : this.currentAngle < this.targetAngle) && this.angleAdd !== 0) requestAnimationFrame(() => this.anime(this.animationCallback, true))
            else {
                this.currentAngle = this.currentAngle % (Math.PI*2)
                this.targetAngle = this.targetAngle % (Math.PI*2)
                this.animated = false
                this.animationCallback()
            }
        }
    }

}
