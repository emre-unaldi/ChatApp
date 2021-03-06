const redisClient = require('../redisClient'); 

// Users sınıfı
function Users(){ // Bu sınıf çalıştığında constructor da çalışmış olcak ve redise bağlantı kurulacak.
    this.client = redisClient.getClient();
}

module.exports = new Users();

// Kullanıcı ekleme fonksiyonu 
Users.prototype.upsert = function (connectionId, meta){
    this.client.hset( 
        'online',  // myhash değerimizin karşılığı/adı
        meta._id, // kullanıcımızın id si
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
Users.prototype.remove = function (_id){
    this.client.hdel(
        'online',
        _id,
        err => {
            if(err){
                console.log(err);
            }
        }
    );
};

// Kullanıcıları listeleme fonksiyonu
Users.prototype.list = function (callback) {
    let active = []; // aktif kullanıcıları depolamak için dizi

    this.client.hgetall('online', function (err, users) { // online hash indeki verileri getirir.
        if(err){
            console.log(err);
            return callback([]); // hata varsa callback e boş dizi dön 
        }

        for (let user in users){
            active.push(JSON.parse(users[user]));
            // jsonda data string olarak durduğu için jsona parse ediyoruz.
        }

        return callback(active); // hata yoksa callback e active dizisini dön 
    })
};