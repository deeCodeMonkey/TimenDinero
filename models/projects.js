module.exports = function (sequelize, DataTypes) {
    var Project = sequelize.define("Project", {
        project_title: DataTypes.STRING,
        date: DataTypes.DATEONLY,
        task: DataTypes.STRING,
        description: DataTypes.STRING,
        hours: DataTypes.DECIMAL(10, 2),
        rate: DataTypes.DECIMAL(10, 2),
        notes: DataTypes.TEXT,
        ext_amt: DataTypes.DECIMAL(10, 2)
    });

    Project.associate = function (models) {
        // A Project can't be created without a Client_id due to the foreign key constraint
        Project.belongsTo(models.Client, {
            foreignKey: {
                name: 'client_id',
                allowNull: false,
            },
            foreignKeyConstraint: true,
            onDelete: 'cascade'

        });
    };
    return Project;
};

