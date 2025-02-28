// priority: 100
const EliteEvent = {}
let EliteList = {}
let EliteEvent$Death = {}
let EliteEvent$Hurt = {}
let EliteEvent$Attack = {}
let EliteEvent$Tick = {}
/**@type {Record<String,{displayerName:string,change:(player:$Player_)=>number,attribute:Array<(entity:$LivingEntity_)>,allow:(entity:$LivingEntity_)boolean}>,} */
let EliteEvent$Register = {}

/**
 * @param {String} extra 
 * @param {(event:EliteEvent$TickEvent)} event 
 */
EliteEvent.onTick=(extra,event)=>{
    EliteEvent$Tick[`"${extra}"`] = HandlerEvent => event(HandlerEvent)
}
/**
 * @param {String} extra 
 * @param {(event:EliteEvent$DeathEvent)} event 
 */
EliteEvent.onEntityDeath = (extra, event) => {
    EliteEvent$Death[`"${extra}"`] = HandlerEvent => event(HandlerEvent)
}
/**
 * @param {String} extra 
 * @param {(event:EliteEvent$HurtEvent)} event 
 */
EliteEvent.onEntityHurt$Pre = (extra, event) => {
    EliteEvent$Hurt[`"${extra}"` + "Hurt"] = HandlerEvent => event(HandlerEvent)
}
/**
 * @param {String} extra 
 * @param {(event:EliteEvent$HurtEvent)} event 
 */
EliteEvent.onEntityHurt$Post = (extra, event) => {
    EliteEvent$Hurt[`"${extra}"` + "Hurt"] = HandlerEvent => event(HandlerEvent)
}
/**
 * @param {String} extra 
 * @param {(event:EliteEvent$AttackEvent)} event 
 */
EliteEvent.onEntityAttack$pre = (extra, event) => {
    EliteEvent$Attack[`"${extra}"` + "Hurt"] = HandlerEvent => event(HandlerEvent)
}
/**
 * @param {String} extra 
 * @param {(event:EliteEvent$AttackEvent)} event 
 */
EliteEvent.onEntityAttack$Post = (extra, event) => {
    EliteEvent$Attack[`"${extra}"` + "Damage"] = HandlerEvent => event(HandlerEvent)
}

/**
 * 注册精英怪怪词条
 * @param {(event:EliteUtil$Register)} event 
 */
EliteEvent.register = event => {
    event(EliteUtil$Register)
    EliteUtil$Register.overBuilder()
}

let EliteUtil$Register = {
    name: '',
    value: {},
    register(name) {
        this.overBuilder()
        this.name = name
        this.value.change = () => 1
        this.value.allow = () => false
        this.value.attribute = []
        return EliteUtil$Register$Setting
    },
    overBuilder() {
        if (this.name == '') return
        EliteEvent$Register[this.name] = this.value
        this.name = ''
        this.value = {}
    }
}
let EliteUtil$Register$Setting = {
    /**@param {(player:$Player_)=>number} callback */
    setChange(callback) {
        EliteUtil$Register.value.change = callback
        return this
    },
    setDisplayerName(name) {
        EliteUtil$Register.value.displayerName = name + '§r '
        return this
    },
    /**
     * @param {Special.Attribute} attrName 
     * @param {number} value 
     * @param {("multiply_base") | ("multiply_total") | ("addition")} operation 
     */
    addAttribute(attrName, value, operation) {
        EliteUtil$Register.value.attribute.push(entity => {
            if (entity.attributes.hasAttribute(attrName)) {
                entity.modifyAttribute(attrName, EliteUtil$Register.name + attrName, value, operation)
            }
        })
        return this
    },
    /**@param {(entity:$LivingEntity_)boolean} callback */
    allow(callback) {
        EliteUtil$Register.value.allow = callback
        return this
    }
}