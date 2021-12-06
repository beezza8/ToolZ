const os = require('os')
const shell = require("shelljs")
class IO {
    constructor(ver, owner, admins) {
        this.ver = ver
        this.owner = owner
        this.admins = admins
    }
    IOWarn() {
        console.log("WARNED by IO.IOWarn")
    }
    ShowVersion() {
        console.log(this.ver)
    }
    GetUserInfo() {
        os.platform()
    }
}


const input = require("input")
const fs = require("fs")
let cmd
let version = "1.0.0-BETA"
const io = new IO(version, "Beezza", "[]")

if (!fs.existsSync("ToolZ.log")) {
    console.log("ログファイルを生成しています...")
    fs.appendFileSync("ToolZ.log", "THIS FILE IS TOOLZ'S LOG FILE!\n")
}

function writelog() {
    fs.appendFileSync("ToolZ.log", cmd + "\n")
}


(async() => {
    if (!fs.existsSync("ToolZ-user.bez")) {
        console.log("- - # # 初回セットアップ # # - -")
        console.log("githubからソースコードをクローン中...")
        if (!shell.which("git")) {
            console.log("gitがインストールされていないため続行することができませんでした\ngitをインストールしてください")
            process.exit(1)
        }
        shell.exec("git clone https://github.com/beezza8/ToolZ")
        
        console.log("完了")
        let uname = await input.text("ユーザー名 : ")
        if (uname === "") {
            uname = "User"
            console.log("ユーザー名が入力されなかったため初期値の'User'が当てはめられました")
        }
        fs.appendFileSync("ToolZ-user.bez", uname + ":")
        console.log("- - # # # # # # # # - -")
    }

    await console.log(`
    ###########################################################
    ###########################################################
    ###                                                     ###
    ###             Welcome to ToolZ(${io.ver})            ###
    ###                                                     ###
    ###########################################################
    ###########################################################`)
    await console.log('"exit"と入力して終了')
    while (true) {
        const user = fs.readFileSync("ToolZ-user.bez", "utf8").split(":")[0]
        cmd = await input.text(user + "@localhost >")
        switch (cmd) {
            case "exit":
                console.log("正常に終了しました")
                writelog()
                return
            case "test":
                console.log("テスト完了")
                writelog()
                break
            case "touch":
                const fname = await input.text("作成するファイル名を入力してください :")
                if (fs.existsSync(fname)) {
                    console.log("すでに同じファイル名のファイルが存在しています！")
                    writelog()
                    break
                }else {
                    fs.writeFileSync(fname, "")
                    writelog()
                    break
                }
            case "version":
            case "v":
                console.log(version)
                writelog()
                break
            case "reset":
                writelog()
                const ans = await input.text("本当にリセットしますか？[y(Yes), n(No)] :")
                if (ans === "y" || ans === "Yes" || ans === "yes") {
                    fs.unlinkSync("ToolZ-user.bez")
                    console.log("正常にリッセットしました！")
                    return
                }else {
                    console.log("y(yes)以外が入力されたため中断しました")
                    break
                }
            case "warn":
                io.IOWarn()
                break
            case "cat":
                const cat_path = await input.text("対象ファイル名 :")
                if (!fs.existsSync(cat_path)) {
                    console.log("そのようなファイルは存在しません")
                    break
                }
                const cat_data = fs.readFileSync(cat_path, "utf-8")

                console.log("####################################################################################")
                console.log(cat_data)
                console.log("####################################################################################")
                break
            default:
                console.log(`Command "${cmd}" not found!`)
        }
    }
})()