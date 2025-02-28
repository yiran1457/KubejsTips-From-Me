// priority: -100


let $LivingEvent$LivingTickEvent = Java.loadClass('net.minecraftforge.event.entity.living.LivingEvent$LivingTickEvent')
let $LivingHurtEvent = Java.loadClass('net.minecraftforge.event.entity.living.LivingHurtEvent')
let $LivingDamageEvent = Java.loadClass('net.minecraftforge.event.entity.living.LivingDamageEvent')
let $LivingDeathEvent = Java.loadClass('net.minecraftforge.event.entity.living.LivingDeathEvent')
EntityEvents.spawned(event => {
    /**@type {$LivingEntity_} */
    let entity = event.entity

    if (!entity.isLiving()) return

    let level = event.level
    let player = level.getNearestPlayer(entity, 64)
    let entityName = ''
    let persistentData = entity.persistentData
    persistentData.Elite = []

    for (let key in EliteEvent$Register) {
        let { change, displayerName, attribute, allow } = EliteEvent$Register[key]
        if (Math.random() > change(player)) break
        if (!allow(entity)) break
        attribute.map(callback => callback(entity))
        persistentData.Elite.push(key)
        entityName += displayerName
    }

    if (persistentData.Elite.length == 0) return
    entity.health = entity.maxHealth
    entityName += '精英'
    entity.setCustomName(entityName)
    entity.setCustomNameVisible(true)
})
/**
 * @param {"Damage"|"Hurt"} extra 
 * @param {$LivingHurtEvent_} event 
 */
let EliteEventHurt = (extra, event) => {
    let { entity, source } = event
    let { immediate, actual } = source
    if (!entity) return
    let HurtElite = entity.persistentData.Elite
    if (HurtElite)
        HurtElite.forEach(Elite => {
            if (EliteEvent$Hurt[Elite + extra] === undefined) return
            EliteEvent$Hurt[Elite + extra](
                Object.assign({
                    attackerInImmediate: immediate,
                    attackerInActual: actual,
                    hurter: entity
                }, event)
            )
        })
    if (!actual) return
    let AttackElite = actual.persistentData.Elite
    if (AttackElite)
        AttackElite.forEach(Elite => {
            if (EliteEvent$Attack[Elite + extra] === undefined) return
            EliteEvent$Attack[Elite + extra](
                Object.assign({
                    attacker: actual,
                    hurter: entity
                }, event)
            )
        })
}
NativeEvents.onEvent($LivingEvent$LivingTickEvent,/**@param {$LivingEvent$LivingTickEvent_} event */event =>{
    let { entity } = event
    let TickElite = entity.persistentData.Elite
    if (TickElite)
        TickElite.forEach(Elite => {
            if (EliteEvent$Tick[Elite] === undefined) return
            EliteEvent$Tick[Elite](event)
        })
})
NativeEvents.onEvent($LivingHurtEvent, event => EliteEventHurt('Hurt', event))
NativeEvents.onEvent($LivingDamageEvent, event => EliteEventHurt('Damage', event))
NativeEvents.onEvent($LivingDeathEvent,/**@param {$LivingDeathEvent_} event */event=>{
    let { entity, source } = event
    let { immediate, actual } = source
    let DeathElite = entity.persistentData.Elite
    if(DeathElite)
        DeathElite.forEach(Elite => {
            if (EliteEvent$Death[Elite] === undefined) return
            EliteEvent$Death[Elite](
                Object.assign({
                    attackerInImmediate: immediate,
                    attackerInActual: actual,
                    hurter: event.entity
                }, event)
            )
        })
})
/**
 * @typedef {{attackerInImmediate:$LivingEntity_,attackerInActual:$LivingEntity_,hurter:$LivingEntity_}&$LivingHurtEvent_} EliteEvent$HurtEvent
 * @typedef {{attackerInImmediate:$LivingEntity_,attackerInActual:$LivingEntity_,hurter:$LivingEntity_}&$LivingDeathEvent_} EliteEvent$DeathEvent
 * @typedef {{attacker:$LivingEntity_,hurter:$LivingEntity_}&$LivingHurtEvent_} EliteEvent$AttackEvent
 * @typedef {$LivingEvent$LivingTickEvent_} EliteEvent$TickEvent
 */