var pool = require("./mysqlConnector");

exports.SQL = {
    Query: function(query, types = null, callback) {
        pool.getConnection(function(err, conn) {
            if(err) {
                callback(false, err);
                return;
            }
    
            if(types == null) {
                console.log("no types");
                conn.query(query, function(err, rows) {
                    conn.release();
                    if(!err) {
                        callback(true, {result: rows});
                    }
                });
            } else {
                console.log("types!");
                conn.query(query, types, function(err, rows) {
                    conn.release();
                    if(!err) {
                        callback(true, {result: rows});
                    }
                });
            }
    
            conn.on('error', function(err) {
                callback(false, err);
                return;
            });
        });
    }
}