const Redis = require('ioredis'); 
const { use } = require('passport');

// Users sınıfı
function Users(){ // Bu sınıf çalıştığında constructor da çalışmış olcak ve redise bağlantı kurulacak.
    this.client = Redis.createClient({
        host: process.env.REDIS_URI,
        port: process.env.REDIS_PORT
    });
}

module.exports = new Users();

// Kullanıcı ekleme fonksiyonu 
Users.prototype.upsert = function (connectionId, meta){
    this.client.hset( 
        'online',  // myhash değerimizin karşılığı/adı
        meta.googleId, // kullanıcımızın id si
        JSON.stringify({ // kullanıcı ile ilgili detayları içeren data
            connectionId,
            meta,
            when: Date.now()
        }),
        err => {
            if(err){
                console.log(err);
            }
        }
    )
};

// Kullanıcı silme fonksiyonu 
Users.prototype.remove = function (googleId){
    this.client.hdel(
        'online',
        googleId,
        err => {
            if(err){
                console.log(err);
            }
        }
    );
};

// Kullanıcıları listeleme fonksiyonu
Users.prototype.list = function (callback) {
    let active = [];

    this.client.hgetall('online', function (err, users) {
        if(err){
            console.log(err);
            return callback([]);
        }

        for (let user in users){
            active.push(JSON.parse(users[user]));
        }

        return callback(active);
    })
};