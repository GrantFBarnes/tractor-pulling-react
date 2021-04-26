USE tractor_pulling;
SELECT pullers.first_name,
    pullers.last_name,
    classes.category,
    classes.weight,
    tractors.brand,
    tractors.model,
    hooks.distance,
    hooks.position
FROM hooks
    INNER JOIN classes ON hooks.class = classes.id
    INNER JOIN pullers ON hooks.puller = pullers.id
    INNER JOIN tractors ON hooks.tractor = tractors.id;