import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductCategory } from '../product/models/category.model';
import { Vendor } from '../vendor/models/vendor.model';
import { Sequelize } from 'sequelize-typescript';
import { IdVerificationStatus, User } from '../user/models/user.model';
import { businessInfo, docs, verificationType } from './types';
import { FundManager } from '../fund-manager/models/fundManager.model';
import { Builder } from '../builder/models/builder.model';

@Injectable()
export class SuperAdminVerificationService {
  constructor(
   
    @InjectModel(User)
    private readonly userModel: typeof User,
    private readonly sequelize: Sequelize,
  ) {}

 

  async getPendingVerifications({user}:{user?:User}){
    const pendingUsers = await this.userModel.findAll({where:{IdVerificationStatus:IdVerificationStatus.PENDING}})
    const data:verificationType[] = []
    return pendingUsers.reduce((curr,acc)=>{
      const file:verificationType = {
        customerName: acc.businessName||acc.name,
        customerType: acc.userType,
        phoneNumber: acc.phoneNumber,
        signupDate: acc.createdAt,
        IdVerificationStatus: acc.IdVerificationStatus,
        userId: acc.id
      }
      curr.push(file)
      return curr
    },data)
  }

  async getOngoingVerifications({user}:{user:User}){
    const pendingUsers = await this.userModel.findAll({where:{IdVerificationStatus:IdVerificationStatus.ONGOING}})
    const data:verificationType[] = []
    return pendingUsers.reduce((curr,acc)=>{
      const file:verificationType = {
        customerName: acc.businessName||acc.name,
        customerType: acc.userType,
        phoneNumber: acc.phoneNumber,
        signupDate: acc.createdAt,
        IdVerificationStatus: acc.IdVerificationStatus,
        userId: acc.id
      }
      curr.push(file)
      return curr
    },data)  }

  async getCompleteVerifications({user}:{user:User}){
    const pendingUsers = await this.userModel.findAll({where:{IdVerificationStatus:IdVerificationStatus.COMPLETED}})
    const data:verificationType[] = []
    return pendingUsers.reduce((curr,acc)=>{
      const file:verificationType = {
        customerName: acc.businessName||acc.name,
        customerType: acc.userType,
        phoneNumber: acc.phoneNumber,
        signupDate: acc.createdAt,
        IdVerificationStatus: acc.IdVerificationStatus,
        userId: acc.id
      }
      curr.push(file)
      return curr
    },data)  }

    async moveToOngoing(userId:string){
      try {
        const userData = await this.userModel.findByPkOrThrow(userId)
        if(userData.IdVerificationStatus ==IdVerificationStatus.ONGOING) throw 'account already ongoing'
        if(userData.IdVerificationStatus ==IdVerificationStatus.COMPLETED)throw "account already completed verification"
        userData.IdVerificationStatus = IdVerificationStatus.ONGOING
        return (await userData.save()).reload()
      } catch (error) {
        throw new BadRequestException (error)
      }
   
    }
    async moveToCompleted(userId:string){
      try {
        const userData = await this.userModel.findByPkOrThrow(userId)
        if(userData.IdVerificationStatus ==IdVerificationStatus.COMPLETED) throw 'account already Completed'
        userData.IdVerificationStatus = IdVerificationStatus.COMPLETED
        return (await userData.save()).reload()
      } catch (error) {
        throw new BadRequestException (error)
      }
   
    }
    async reviewUserDoc(userId:string){
        const userData = await this.userModel.findOne({where:{id:userId},include:[{model:FundManager},{model:Builder},{model:Vendor}]})
        if(!userData)return new BadRequestException("no such user ")
        const data:docs = {
          certificateOfLocation: userData?.Builder?.certificateOfLocation||userData?.Vendor?.certificateOfLocation||"",
          certificateOfIncorporation: userData?.Builder?.certificateOfIncorporation||userData?.Vendor?.certificateOfIncorporation||"",
          UtilityBill: userData?.Builder?.UtilityBill||userData?.Vendor?.UtilityBill||'',
          businessContactSignature: userData?.Builder?.BusinessContactSignature||userData?.Vendor?.businessContactSignature||"",
          IdVerificationStatus: userData?.IdVerificationStatus,
          businessContactId: userData?.Builder?.BusinessContactId||userData?.Vendor?.businessContactId||"",
          other_docs:userData?.Builder?.other_docs||userData?.Vendor?.other_docs||"",
          userId:userData.id
        }
        return data
    }
    async businessDetails(userId:string){
        const userData = await this.userModel.findOne({where:{id:userId},include:[{model:FundManager},{model:Builder},{model:Vendor}]})
        if(!userData)return new BadRequestException("no such user ")
        const data:businessInfo = {
          userId: userData.id,
          Business_Address:userData?.Builder?.businessAddress||userData?.Vendor?.businessAddress||userData.FundManager.businessAddress,
          business_registration_no: userData?.Builder?.businessRegNo||userData?.Vendor?.businessRegNo||userData.FundManager.businessRegNo,
          business_size: userData?.Builder?.businessSize||userData?.Vendor?.businessSize||userData.FundManager.businessRegNo,
        }
        return data
    }
}
