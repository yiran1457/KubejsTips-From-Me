EliteEvent.register(e => {
    e.register('test')
        .setChange(player => {
            if (!player) return 0
            if (player.server.persistentData.level==3)
                return 0.25
            return 1
        })
        .setDisplayerName('§6小测试')
        .addAttribute('generic.max_health', 0.1, 'multiply_base')
        .allow(entity => entity.isMonster())
        .addAttribute('generic.armor', 1, 'addition')
})


EliteEvent.onEntityHurt$Pre('test',e=>{
    let {attackerInActual,attackerInImmediate,hurter} = e
    if(attackerInActual && attackerInActual.isPlayer())
        attackerInActual.tell(`哈哈哈，孩子们，我肘击了[${hurter.customName.string}]`)
})
EliteEvent.onEntityAttack$pre('test',e=>{
    let {attacker,hurter} = e
    if(hurter&&hurter.isPlayer())
        hurter.tell(`孩子们，我被[${attacker.customName.string}]肘击了`)
})
EliteEvent.onEntityDeath('test',e=>{
    let {attackerInActual,attackerInImmediate,hurter} = e
    if(attackerInActual && attackerInActual.isPlayer())
        attackerInActual.tell(`哈哈哈，孩子们，我肘死了[${hurter.customName.string}]`)
})
EliteEvent.onTick('test',e=>{
    e.entity.potionEffects.add('absorption',100,0,false,true)
})
