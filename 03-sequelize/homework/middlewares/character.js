const { Router } = require("express");
const { Op, Character, Role } = require("../db");
const router = Router();

router.post("/", async (req, res) => {
  const { code, name, hp, mana } = req.body;
  if (!code || !name || !hp || !mana) {
    return res.status(404).send("Falta enviar datos obligatorios");
  }
  try {
    let personaje = await Character.create({ ...req.body });
    //console.log('personaje creado');
    return res.status(201).json(personaje);
  } catch (e) {
    return res.status(404).send("Error en alguno de los datos provistos");
  }
});

router.get("/", async (req, res) => {
  const { race, age } = req.query;
  const condition = {};
  const where = {};
  try {
    if (race) where.race = race;
    if (age) where.age = age;
    condition.where = where;
    const characters = await Character.findAll(condition);
    res.json(characters);
  } catch (e) {
    return res.send(e);
  }
});

// Implementaremos un nuevo endpoint que deberá traer todos los personajes considerados "jovenes" que serán aquellos con menos de 25 años. CUIDADO con el orden de las rutas...

router.get("/young", async (req, res) => {
  const characters = await Character.findAll({
    where: {
      age: {
        [Op.lt]: 25,
      },
    },
  });
  res.json(characters);
});

// GET /characters/roles/:code
// Crearemos otro endpoint para obtener todos los datos del personajes pero incluyendo también la información asociada a sus roles. Por ejemplo debería devolver algo así:

// {
//       age: '27 years old',
//       code: 'ONE',
//       name: 'First',
//       race: 'Human',
//       hp: 90,
//       mana: 150,
//       date_added: '2022-03-27',
//       Roles: [
//         {
//           id: 1,
//           name: 'Tank',
//           description: null
//         },
//         {
//           id: 2,
//           name: 'Top',
//           description: null
//         }
//       ]
//     }

router.get("/roles/:code", async (req, res) => {
    const { code } = req.params;
    try {
        const result = await Character.findByPk(code, {
            include: [Role]
        });
        if (!result) {
            return res
                .status(404)
                .send(`El código ${code} no corresponde a un personaje existente`);
        } else {
            return res.json(result);
        }
    } catch (e) {
        return res.send(e);
    }
}
);

router.get("/:code", async (req, res) => {
  const { code } = req.params;
  try {
    const result = await Character.findByPk(code);
    if (!result) {
      return res
        .status(404)
        .send(`El código ${code} no corresponde a un personaje existente`);
    } else {
      return res.json(result);
    }
  } catch (e) {
    return res.send(e);
  }
});

//PUT /character/addAbilities
// Similar al enpodint anterior pero ahora queremos poder desde el lado del personaje agregar una o mas habilidades en simultaneo que las recibiremos como un array dentro del body del request:

// {
//   codeCharacter: 'TWO',
//   abilities: [
//     { name: 'abilityOne', mana_cost: 17.0 },
//     { name: 'abilityTwo', mana_cost: 84.0 },
//     { name: 'abilityThree', mana_cost: 23.0 }
//   ]
// }

router.put("/addAbilities", async (req, res) => {
    const { codeCharacter, abilities } = req.body;
    if (!codeCharacter || !abilities) {
        return res.status(404).send("Falta enviar datos obligatorios");
    }
    try {
        let character = await Character.findByPk(codeCharacter);
        if (!character) {
            return res.status(404).send("No existe el personaje");
        }
        const promises = abilities.map(async (ability) => {
            await character.createAbility(ability);
        }
        );
        await Promise.all(promises);
        return res.send('Abilities added');
    } catch (e) {
        return res.send(e);
    }
}
);




// Vamos a crear un PUT el cual va a recibir un atributo como param y un value como query y deberá modificar todos los valores de dicho atributo con el valor dado para todas las instancias de personajes que existan en la base de datos y cuyo valor de ese atributo sea null.



router.put("/:attribute", async (req, res) => {
  const { attribute } = req.params;
  const { value } = req.query;
  try {
    const result = await Character.update(
      { [attribute]: value },
      { where: { [attribute]: null } }
    );
    return res.send('Personajes actualizados');
  } catch (e) {
    return res.send(e);
  }
});



module.exports = router;
