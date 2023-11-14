
const flashMesssage = function (req) {
    let message = req.flash('message')
    req.flash('message', null)
    if (message === []) {
        message = undefined
    } else {
        message = message[0]
    }
    return message
}

const sendToRestrictedPage = function(req,res){
    const auth = req.isAuthenticated()
    let loggedin = 0
    res.render(`pages/restrictedPage`, {
        title: auth ? '403 You don\'t have Access to this Page' : '401 You are not Logged In',
        message: undefined,
        role: 0,
        loggedin: loggedin,
        isMainPage: 1,
        auth: auth
    })
    return
}

module.exports = {
    sendToRestrictedPage: sendToRestrictedPage,
    flashMesssage: flashMesssage
}