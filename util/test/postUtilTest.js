module.exports = function (PostModel, post_id, catagories) {
    return PostModel.create({
      post_id,
      topic : "Naratip Simulater",
      body : "Simulation of New Naratip",
      writer : "New himself",
      catagories : "Action"
    }).then((response) => response["$attributes"])
}
