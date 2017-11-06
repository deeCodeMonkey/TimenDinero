module.exports = function (sequelize, DataTypes) {
    var Client = sequelize.define("Client", {
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: false, //user to enter client_id
        },
        company_name: DataTypes.STRING,
        logo: DataTypes.STRING,
        contact_person: DataTypes.STRING,
        email_address: DataTypes.STRING,
        phone: DataTypes.STRING,
        mailing_address: DataTypes.STRING
    });

    Client.associate = function (models) {
        Client.hasMany(models.Project, {
            foreignKey: {
                name: 'client_id',
                allowNull: false,
            },
            foreignKeyConstraint: true,
            onDelete: 'cascade'
        });
    };

    return Client;
};


