/**
 * 项目相关域名配置
 */
const ENV = process.env.NODE_ENV
const CONFIG = (() => {
	if (ENV === "production") {
		return {
			baseUrl: "/api",
		}
	} else {
		return {
			baseUrl: "/app",
		}
	}
})()

export default CONFIG
