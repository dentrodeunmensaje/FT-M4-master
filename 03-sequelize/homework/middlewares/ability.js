const { Router } = require("express");
const { Ability } = require("../db");
const router = Router();

// PUT /ability/setCharacter
// Recibirá por body idAbility y codeCharacter y deberá asociarlos a partir del modelo de Ability y devolver el objeto de habilidad con name, description, mana_cost y CharacterCode.

router.put("/setCharacter", async (req, res) => {
    const { idAbility, codeCharacter } = req.body;
    const ability = await Ability.findByPk(idAbility);
    await ability.setCharacter(codeCharacter);
    return res.json(ability);
}
);


//Debe recibir por body los datos del modelo de Ability y crear una instancia del mismo en la base de datos.

// De no recibir todos los parámetros necesarios debería devolver un status 404 con el mensaje "Falta enviar datos obligatorios"
// Si todos los datos son provistos debera devolver un status 201 y el objeto de la habilidad

router.post("/", async (req, res) => {
    const { name, description, mana_cost } = req.body;
    if (!name || !mana_cost) {
        return res.status(404).send("Error en alguno de los datos provistos");
    }
    try {
        let ability = await Ability.create({ ...req.body });
        //console.log('ability creado');
        return res.status(201).json(ability);
    } catch (e) {
        return res.status(404).send("Error en alguno de los datos provistos");
    }
}
);



module.exports = router;
