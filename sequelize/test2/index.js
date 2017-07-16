/*
 * @Author: kasora 
 * @Date: 2017-07-13 23:57:08 
 * @Last Modified by: kasora
 * @Last Modified time: 2017-07-16 17:31:24
 */
'use strict';

const Sequelize = require('sequelize');
const expect = require('chai').expect;

const { database } = require('../config');

const sequelize = new Sequelize(
  database.database,
  database.user,
  database.password,
  {
    logging: false,
    host: database.host,
    port: database.port,
    dialect: 'mysql'
  }
);

let User = sequelize.define('user',
  {
    name: {
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING(500),
      defaultValue: 'hello'
    },
    password: {
      type: Sequelize.STRING
    }
  },
  {
    freezeTableName: true,
    // timestamps: false

    // 需要注意的是，instanceMethods 与 classMethods 方法
    // 在 V4 版本中被移除。本教程使用 V4 所以只提供样例
    // instanceMethods: {
    //   // V3 版本中我们可以在这里为模型添加自定义方法
    //   // 这里的方法可以被该模型的实例调用
    //   // 例如我们添加一个 toJSON 方法
    //   toJSON: function () {
    //     let data = this.get();
    //     delete data.password;
    //     return data;
    //   }
    // }
  }
);
// V4 版本中调用 define 会返回一个继承自模型的类。
// 所以我们现在可以通过调用模型的 prototype 更灵活更动态的添加方法。
// 另外值得一提的是 toJSON 方法如果不手动提供则默认返回 get({ plain: true });
User.prototype.toJSON = function () {
  // 使用 get 方法获取实例中的所有字段数据。
  let data = this.get();

  // 这里我们可以对总数据进行一次筛选
  // 例如我们不想将 password 展示给用户
  // 我们可以在这里剔除掉 password 
  // 这样就可以确保所有经过 toJSON 转换的函数都可以保证安全性。
  delete data.password;
  return data;
};

let Work = sequelize.define('work',
  {
    // 如果单纯的声明类型可以直接写
    name: Sequelize.STRING,

    // 需要注意所有的 id 都是 INTEGER 类型。
    userId: Sequelize.INTEGER,
    // 你也可以提供 get/set 对数据进行预处理
    // 下面就是保存一个数组的简单方法
    type: {
      type: Sequelize.STRING,
      defaultValue: '[]',
      set: function (val) {
        try {
          // 可以通过 this.setDataValue(‘<field>’, value) 来手动设定指定字段的值
          this.setDataValue('type', JSON.stringify(val));
        } catch (err) {
          this.setDataValue('type', '[]');
        }
      },
      get: function () {
        try {
          // 如果你尝试获取 this.<field> 
          // Sequelize 会自动调用对应字段的 get 方法
          // 而使用 this.getDataValue(‘<field>’) 来获取就可以得到原始数据
          let val = this.getDataValue('type');
          return JSON.parse(val);
        } catch (err) {
          return '[]';
        }
      }
    }
  },
  {
    freezeTableName: true,
    // V3 版本写法
    // instanceMethods: {
    //   toJSON: function () {
    //     let data = this.get();
    //     if (data.user) {
    //       data.user = data.user.toJSON();
    //     }
    //     // ---------------------------------
    //     // let data = this.get({ plain: true });
    //     // if (data.user) {
    //     //   delete data.user.password;
    //     // }

    //     return data;
    //   }
    // }
  }
);
// V4 版本写法
Work.prototype.toJSON = function () {
  // plain 参数只在引用其他模型时有意义
  // 具体效果为 plain 为 false 时，引入的是一个实例
  // 而 plain 为 true 时，则会调用其 get 方法，引入的是具体的数据。
  // 以下两种写法在此例中实现的效果相同
  // 我们可以看出第一种方法更为优雅
  // 但是如果我们不是很需要特殊处理，plain 设为 true 也是较为方便的办法。
  let data = this.get();
  if (data.user) {
    data.user = data.user.toJSON();
  }
  // ---------------------------------
  // 另一种写法（不推荐）
  // let data = this.get({ plain: true });
  // if (data.user) {
  //   delete data.user.password;
  // }

  return data;
};

let init_db = async () => {
  await User.sync({ force: true });
  await Work.sync({ force: true });

  // 我们接下来将一个 Work 绑定到 User 上
  // 这里的 as 中的值会作为引用的 key
  await Work.belongsTo(User, { as: 'user', foreignKey: 'userId' });
};

let insertData = async () => {
  // create 方法的返回值是一个实例。所以可以调用实例的方法。
  let userInfo = await User.create({ name: 'kasora', password: 'hello-kasora' });
  userInfo = userInfo.toJSON();
  // 由于我们设置了 set 方法，我们传入的数据会自动调用 set 方法
  // 在这个例子中就会吧数组转成字符串存储。
  await Work.create({ type: ['haha', 'money'], userId: userInfo.id, name: 'kasora-work' });
};

let getData = async () => {
  let workData = await Work.findOne({
    where: { name: 'kasora-work' },
    // 引入对应的 User 实例。
    include: [{
      model: User,
      as: 'user'
    }]
  });
  workData = workData.toJSON();
  return workData;
};

// 让我们开始吧
let start = async () => {
  await init_db();
  await insertData();
  let workData = await getData();
  expect(workData.user.password).to.not.be.ok;
};

start();