export default class ProfileRound {
    
    /**
     * @type {Function}
     */
    timer = null

    /**
     * @type {Profile}
     */
    myProfile = null

    /**
     * 
     * @param {HTMLElement} round
     * @param {Array.<Profile>} profiles
     */
    constructor (round, duration = 400, profiles = []) {
        this.round = round
        this.duration = duration
        this.profiles = []
        profiles.forEach(profile => this.addProfile(profile))
        this.showProfiles(profiles)
        this.align()
    }

    /**
     * 
     * @returns {Array.<Profile>}
     */
    getInvisibleProfiles () {
        return this.profiles.filter(profile => !profile.visible)
    }

    /**
     * 
     * @returns {Array.<Profile>}
     */
    getVisibleProfiles () {
        return this.profiles.filter(profile => profile.visible)
    }

    /**
     * 
     * @param {number} index
     * @returns {number}
     */
    getAngle (index) {
        index = index - this.profiles.findIndex(profile => profile === this.myProfile)
        if (index < 0) index += this.profiles.length
        return index * (Math.PI*2) / this.profiles.length
    }

    /**
     * 
     * @param {Profile} profile
     */
    addProfile (profile) {
        if (profile.isMe) {
            this.myProfile = profile
            this.profiles.forEach(theProfile => { theProfile.hide(this.duration, () => this.align())})
        }
        if (isNaN(profile.position)) {
            profile.position = this.profiles.length
            this.profiles.push(profile)
        } else {
            this.profiles.splice(profile.position, 0, profile)
        }
        const child = profile.element
        this.round.appendChild(child)
        if (!profile.isMe || this.getVisibleProfiles().length <= 1) this.align()
    }

    /**
     * 
     * @param {Profile} profile
     */
    removeProfile (profile) {
        const removeElement = () => {
            this.round.removeChild(profile.element)
            this.profiles.splice(this.profiles.findIndex(theProfile => theProfile === profile), 1)
            this.align()
        }
        profile.hide(this.duration, removeElement)
        if (profile === this.myProfile) {
            this.myProfile = null
            this.profiles.forEach(theProfile => theProfile.hide(this.duration))
        }
    }

    /**
     * 
     * @param {Profile} profiles
     */
    showProfiles (profiles) {
        profiles.forEach(profile => profile.show(this.duration))
    }

    /**
     * 
     */
    align () {
        const addedProfiles = this.getInvisibleProfiles()
        this.profiles.forEach((profile, index) => {
            profile.targetAngle = this.getAngle(index)
            profile.setAngleAdd(this.duration / 10)
            const animationEnd = () => {
                if (profile.currentAngle !== profile.targetAngle || this.profiles.length <= 2) this.timer = setTimeout(() => this.showProfiles(addedProfiles), 2)
            }
            clearTimeout(this.timer)
            profile.anime(animationEnd)
        })
    }

}
