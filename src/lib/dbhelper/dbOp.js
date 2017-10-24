/**
 * Created by Martin on 2017/10/24.
 */

const mysql  = require( 'mysql' );
const conf = require("./dbconfig");


const getConnection = function(callback) {
    if (!callback) callback = function () {};
    let pool = mysql.createPool(conf);
    pool.getConnection(function (err, connection) {
        if (err) {
            throw err;
        }
        callback(connection);
    });
};

const querySql = function (sql, params, callBack) {
    getConnection(function (connection) {
        connection.query(sql, params, function (error, res) {
            connection.release();
            if (error)
            {
                console.log('1.>>>>> error : ' + error);
            }
            callBack(error, res);
        })
    })
};

const buildSql = function (operation, tableName, params, whereSql, orderBy) {  // , orderBy, groupby, having
    operation = operation.toUpperCase();
    let sql = null;
    if (operation == "SELECT") {  //'DELETE' 'INSERT' 'UPDATE'
        if (params == null) {
            sql = "SELECT * FROM " + tableName;
        }
        else {
            sql = "SELECT "
            const isArray = Array.isArray(params);
            for (let key in params) {
                if (isArray)
                    sql += params[key] + ", ";
                else
                    sql += key + ", ";
            }
            if (sql == "SELECT ")
                sql = "SELECT * FROM ";
            else
                sql = sql.substring(0, sql.length - 2)
            sql += " FROM " + tableName;
        }
        if (whereSql)
        {
            if (typeof whereSql == 'string')
            {
                if (whereSql.toUpperCase().indexOf('WHERE') > -1)
                    sql += " " + whereSql;
                else
                    sql += " WHERE " + whereSql;
            }
            else
            {

                let statement = '';
                for (var key in whereSql)
                {
                    if (typeof whereSql[key] == 'number' || (typeof whereSql[key] == 'string' && whereSql[key].toUpperCase().indexOf('SELECT') > -1)) {
                        statement += ' ' + key + '=' + whereSql[key] + " and";
                    }
                    else{
                        statement += " "  + key + "='" +  whereSql[key] + "' and";
                    }
                }
                if (statement.length > 0){
                    statement = statement.substring(0, statement.length - 4);
                    sql += " WHERE" + statement;
                }
            }
        }
        if (orderBy)
        {
            if (typeof orderBy == 'string')
            {
                if (orderBy.toUpperCase().indexOf('ORDER BY') > -1)
                    sql += " " + orderBy;
                else
                    sql += " ORDER BY " + orderBy;
            }
            else
            {
                let statement = '';
                for (let key in orderBy)
                {
                    if (typeof whereSql[key]) {
                        statement += key + ' ' + orderBy[key] + ", ";
                    }
                }
                if (statement.length > 0){
                    statement = statement.substring(0, statement.length - 2);
                    sql += " ORDER BY " + statement;
                }
            }
        }
    }
    else if(operation == "DELETE")
    {
        sql = "DELETE FROM " + tableName;
        if (whereSql || params)
        {
            if (whereSql == null) {
                whereSql = params
            }
            if (typeof whereSql == 'string')
            {
                if (whereSql.toUpperCase().indexOf('WHERE') > -1)
                    sql += " " + whereSql;
                else
                    sql += " WHERE " + whereSql;
            }
            else
            {
                let statement = '';
                for (let key in whereSql)
                {
                    if (typeof whereSql[key] == 'number' || (typeof whereSql[key] == 'string' && whereSql[key].toUpperCase().indexOf('SELECT') > -1)) {
                        statement += ' ' + key + '=' + whereSql[key] + " and";
                    }
                    else {
                        statement += " "  + key + "='" +  whereSql[key] + "' and";
                    }
                }
                if (statement.length > 0)
                    statement = statement.substring(0, statement.length - 4);
                sql += " WHERE" + statement;
            }
        }
    }
    else if (operation == 'UPDATE')
    {
        sql = "UPDATE " + tableName + " set ";
        if (params) {
            for (let index in params) {
                if (typeof params[index] == 'number' || (typeof params[index] == 'string' && params[index].toUpperCase().indexOf('SELECT') > -1)) {
                    sql +=  index + "=" + params[index] + ", ";
                } else {
                    sql +=  index + "=" + "'" + params[index] + "'" + ", ";
                }
            }
            sql = sql.substring(0, sql.length - 2);
        }
        if (whereSql)
        {
            if (typeof whereSql == 'string')
            {
                if (whereSql.toUpperCase().indexOf('WHERE') > -1)
                    sql += " " + whereSql;
                else
                    sql += " WHERE " + whereSql;
            }
            else
            {
                let statement = '';
                for (let key in whereSql)
                {

                    if (typeof whereSql[key] == 'number' || (typeof whereSql[key] == 'string' && whereSql[key].toUpperCase().indexOf('SELECT') > -1)) {
                        statement += ' ' + key + '=' + whereSql[key] + " and";
                    }
                    else {
                        statement += " "  + key + "='" +  whereSql[key] + "' and";
                    }
                }
                if (statement.length > 0)
                    statement = statement.substring(0, statement.length - 4);
                sql += " WHERE" + statement;
            }
        }
    }
    else if (operation == "INSERT") {
        sql = "INSERT INTO " + tableName + "("

        if (params) {
            for (let key in params) {
                sql += key + ", ";
            }
            sql = sql.substring(0, sql.length - 2) + ") values(";
            for (let index in params) {
                if (typeof params[index] == 'number' || (typeof params[index] == 'string' && params[index].toUpperCase().indexOf('SELECT') > -1)) {
                    sql += params[index] + ", ";
                }
                else  {
                    sql += "'" + params[index] + "'" + ", ";
                }
            }
        }
        sql = sql.substring(0, sql.length - 2) + ")";
        if (whereSql)
        {
            if (typeof whereSql == 'string')
            {
                if (whereSql.toUpperCase().indexOf('WHERE') > -1)
                    sql += " " + whereSql;
                else
                    sql += " WHERE " + whereSql;
            }
            else
            {
                let statement = '';
                for (let key in whereSql)
                {

                    if (typeof whereSql[key] == 'number' || (typeof whereSql[key] == 'string' && whereSql[key].toUpperCase().indexOf('SELECT') > -1)) {
                        statement += ' ' + key + '=' + whereSql[key] + " and";
                    }
                    else {
                        statement += " "  + key + "='" +  whereSql[key] + "' and";
                    }
                }
                if (statement.length > 0)
                    statement = statement.substring(0, statement.length - 4);
                sql += " WHERE" + statement;
            }
        }
    }
    sql += ";";
    return sql;
}

const buildPageSelectSql = function (table, orderBy, pageIndex, pageSize) {
    var order = "";
    if (orderBy) {
        if (typeof orderBy == 'string') {
            if (orderBy.toUpperCase().indexOf('ORDER BY') > -1)
                order += " " + orderBy;
            else
                order += " ORDER BY " + orderBy;
        }
        else {
            var orderByStr = " ORDER BY ";
            var statement = '';
            for (var key in orderBy) {
                if (typeof whereSql[key]) {
                    statement += key + ' ' + orderBy[key] + ", ";
                }
            }
            if (statement.length > 0) {
                statement = statement.substring(0, statement.length - 2);
                order += " ORDER BY " + statement;
            }
        }
    }
    if (table.indexOf("SELECT") > -1)
    {
        table = "("+table+")a";
    }
    var pageSelectSql = "SELECT * FROM " +
        "(SELECT row_number() OVER(" + order + ")rownumber, * FROM " + table + ")a " +
        "WHERE rownumber >=" + ((pageIndex - 1) * pageSize + 1) + " and rownumber <= " + pageIndex * pageSize;
    return pageSelectSql;
}

const transactionExecute = function (sqlArray, callBack) {

};

// module.exports.config = conf;
// module.exports.del = del;
// module.exports.select = select;
// module.exports.update = update;
module.exports.querySql = querySql;
// module.exports.querySqlAsync = querySqlAsync;
// module.exports.selectAll = selectAll;
// module.exports.restoreDefaults = restoreDefaults;
// module.exports.add = add;
module.exports.buildSql = buildSql;
module.exports.buildPageSelectSql = buildPageSelectSql;
module.exports.transactionExecute = transactionExecute;