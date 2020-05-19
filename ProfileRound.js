export default class ProfileRound {
    
    /**
     * timeoutId used for the debounce
     * 
     * @type {number}
     */
    timer = null

    /**
     * Profile marked "is me" that must be in the bottom center
     * 
     * @type {Profile}
     */
    myProfile = null

    /**
     * Create new ProfileRound object
     * 
     * @param {HTMLElement} round The element container for the round
     * @param {number} duration The duration in ms (/10 frames) for animations
     * @param {Arrow} arrow Arrow object for pointing the active profile
     * @param {Array.<Profile>} profiles Profiles to add to the round immediatly
     */
    constructor (round, duration = 400, arrow = null, profiles = []) {
        this.round = round
        this.duration = duration
        this.arrow = arrow
        this.profiles = []
        profiles.forEach(profile => this.addProfile(profile))
        this.showProfiles(profiles)
        this.align()
    }

    /**
     * Get profiles marked as invisible
     * 
     * @returns {Array.<Profile>}
     */
    getInvisibleProfiles () {
        return this.profiles.filter(profile => !profile.visible)
    }

    /**
     * Get profiles marked as visible
     * 
     * @returns {Array.<Profile>}
     */
    getVisibleProfiles () {
        return this.profiles.filter(profile => profile.visible)
    }

    /**
     * Set the profile active, add the class `active` to the element and point it with the arrow (if defined)
     * 
     * @param {Profile|undefined} profile The profile to set active or undefined to unset active profile
     */
    setActive (profile = undefined) {
        if (this.activeProfile !== undefined) this.activeProfile.element.classList.remove('active')
        this.activeProfile = profile
        if (this.activeProfile !== undefined) this.activeProfile.element.classList.add('active')
        if (this.activeProfile !== undefined && this.arrow !== null) {
            this.arrow.show()
            this.arrow.setMove(this.activeProfile.targetAngle, this.duration / 20)
            this.arrow.anime()
        } else if (this.arrow !== null) {
            this.arrow.hide()
        }
    }

    /**
     * Get the angle of a profile by its index
     * 
     * @param {number} index Index of the profile in the profiles array
     * @returns {number}
     */
    getAngle (index) {
        index = index - this.profiles.findIndex(profile => profile === this.myProfile)
        if (index < 0) index += this.profiles.length
        return index * (Math.PI*2) / this.profiles.length
    }

    /**
     * Add a profile to the round
     * 
     * @param {Profile} profile Profile to add to the round
     */
    addProfile (profile) {
        const profilesVisibles = this.getVisibleProfiles().length
        if (profile.isMe) {
            if (this.myProfile !== null) this.myProfile.isMe = false
            this.myProfile = profile
            this.profiles.forEach(eachProfile => { eachProfile.hide(this.duration, () => this.align())})
        }
        if (isNaN(profile.position)) {
            profile.position = this.profiles.length+1
            this.profiles.push(profile)
        } else {
            this.profiles.splice(profile.position, 0, profile)
        }
        const child = profile.element
        const after = this.profiles.filter(eachProfile => this.round.contains(eachProfile.element)).find(eachProfile => eachProfile.position >= profile.position)
        this.round.insertBefore(child, after !== undefined ? after.element : null)
        if (!profile.isMe || profilesVisibles < 2) this.align()
    }

    /**
     * Remove a profile in the round
     * 
     * @param {Profile} profile Profile to remove from the round
     */
    removeProfile (profile) {
        const removeElement = () => {
            this.round.removeChild(profile.element)
            this.profiles.splice(this.profiles.findIndex(eachProfile => eachProfile === profile), 1)
            this.align()
        }
        profile.hide(this.duration, removeElement)
        if (profile === this.myProfile) {
            this.myProfile = null
            this.profiles.forEach(theProfile => theProfile.hide(this.duration))
        }
    }

    /**
     * Show each profiles
     * 
     * @param {Array.<Profile>} profiles Profiles to show
     */
    showProfiles (profiles) {
        profiles.forEach(profile => profile.show(this.duration))
    }

    /**
     * Set the angles of the profiles in the round and animate them
     */
    align () {
        const addedProfiles = this.getInvisibleProfiles()
        this.profiles.forEach((profile, index) => {
            profile.setMove(this.getAngle(index), this.duration / 10)
            const animationEnd = () => {
                if (profile.currentAngle !== profile.targetAngle || this.profiles.length <= 2) this.timer = setTimeout(() => this.showProfiles(addedProfiles), 2)
            }
            clearTimeout(this.timer)
            profile.anime(animationEnd)
            if (profile === this.activeProfile && this.arrow !== null) {
                this.arrow.setMove(this.getAngle(index), this.duration / 10)
                this.arrow.anime()
            }
        })
    }

}
