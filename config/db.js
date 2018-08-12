var mysql = require("mysql");
var pool = mysql.createPool({
    host:"rm-wz94j84swx1x9s9u0do.mysql.rds.aliyuncs.com",
    port : 3306,
    user:"wangheng",
    password:"20301314",
    database:"test"
});

function query(sql,callback){
    pool.getConnection(function(err,connection){
        if(err){
            console.error(err)
        }
        connection.query(sql, function (err,rows) {
            callback(err,rows);
            connection.release();
        });
    });
}

exports.query = query;