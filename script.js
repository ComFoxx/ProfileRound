import ProfileRound from './ProfileRound.js'
import Profile from './Profile.js'
import Arrow from './Arrow.js'

class MyProfile extends Profile {
    
    createElement ({id}) {
        const div = document.createElement('div')
        div.id = id

        const img = document.createElement('img')
        if (id !== 800) img.src = "https://picsum.photos/seed/" + id + "/80/80"
        else img.src = "https://via.placeholder.com/80/80"
        img.classList.add('profile')
        this.profileDiameter = '80px'

        const p = document.createElement('p')
        p.textContent = 'Bonjour'
        p.style.textAlign = 'center'

        div.appendChild(img)
        div.appendChild(p)

        return div
    }

}

const round = document.querySelector('.round')

const width = 10
const height = 10
round.innerHTML = `<svg class="arrow" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><polygon points="0,0 ${width},0 ${width / 2},${height}"/></svg>`

class MyArrow extends Arrow {
    
    createElement ({}) {
        return document.querySelector('.arrow')
    }

}

const arrow = new MyArrow()
const rounder = new ProfileRound(round, 400, arrow)
/*
for (let i = 0; i < 1; i++) {
    rounder.addProfile(new MyProfile({id: i * 100}, i, i === 8))
}*/

rounder.addProfile(new MyProfile({id: 'aze'}, 0))
rounder.addProfile(new MyProfile({id: 'azap'}, 1, true))

const newChild = () => {
    rounder.addProfile(new MyProfile({id: Math.floor(Math.random() * (1000 - 1)) + 1}, Math.floor(Math.random() * rounder.profiles.length), document.getElementById('isMe').checked))
}
document.getElementById('addChild').addEventListener('click', newChild)

const removeChild = () => {
    let profile = false
    if (document.getElementById('isMe').checked) profile = rounder.myProfile
    else profile = rounder.profiles.filter(profile => profile.visible).sort(() => 0.5 - Math.random())[0]
    if (profile) rounder.removeProfile(profile)
}
document.getElementById('removeChild').addEventListener('click', removeChild)

let activeProfileIndex = 0
const nextTurn = () => {
    if (rounder.activeProfile !== undefined) activeProfileIndex = (rounder.profiles.findIndex(profile => profile === rounder.activeProfile) + 1) % rounder.profiles.length
    rounder.setActive(rounder.profiles[activeProfileIndex])
}
document.getElementById('nextTurn').addEventListener('click', nextTurn)

const removeTurn = () => {
    rounder.setActive()
}
document.getElementById('removeTurn').addEventListener('click', removeTurn)
