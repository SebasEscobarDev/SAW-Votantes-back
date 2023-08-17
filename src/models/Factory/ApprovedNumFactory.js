import ApprovedNumModel from '../Operations/ApprovedNum.js'
const approvedNum = new ApprovedNumModel()

class ApprovedNum {
  static async totalItems () {
    return await approvedNum.totalItems()
  }

  static async getApprovedNums (options) {
    return await approvedNum.getApprovedNums(options)
  }

  static async getApprovedNum (id) {
    return await approvedNum.getApprovedNum(id)
  }

  static async createApprovedNum (body) {
    return await approvedNum.createApprovedNum(body)
  }

  static async updateApprovedNum (body) {
    return await approvedNum.updateApprovedNum(body)
  }

  static async deleteApprovedNum (body) {
    return await approvedNum.deleteApprovedNum(body)
  }
}

export default ApprovedNum
