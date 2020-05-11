dbconfig = {
  host: 'localhost',
  user: 'root',
  password: '****',
  database: 'pfdb',
  port: 3306
};


instagram = {
  clientID: '*********************************',
  clientSecret: '*********************************',
  callbackURL: "/auth/instagram/callback"
};

google = {
  clientID: '*********************************',
  clientSecret: '*********************************',
  callbackURL: "/auth/google/callback"
};

kakao = {
  clientID: '*********************************',
  callbackURL: "/auth/kakao/callback",
  profileFields:['id', 'name', 'displayName']
};

facebook = {
  clientID: '*********************************',
  clientSecret: '*********************************',
  callbackURL: "/auth/facebook/callback",
  profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
};

session = {
  secret: 'MySecretCode',
  resave: false,
  saveUninitialized: true
};

module.exports = {
  'dbconfig' : dbconfig,
  'instagramConfig' : instagram,
  'googleConfig' : google,
  'kakaoConfig' : kakao,
  'facebookConfig' : facebook,
  'sessionConfig': session
}
