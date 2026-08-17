const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Ledger must be associated with an account"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required for creating a ledger entry"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Ledger must be associated with a transcation"],
        index: true,
        immutable: true
    }, type:{
        type: String,
        enum:{
            values: ["CREDIT", "DEBIT"],
            message: "Type can be either CREDIT or DEBIT",
        },
        required: [true, "Ledger type is required"],
        immutable: true
    }
})

function preventLedgerModification(){
    throw new Error("Ledger entries aare immutable and can not be modified or deleted");
}

ledgerSchema.pew('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pew('updateOne', preventLedgerModification);
ledgerSchema.pew('deleteOne', preventLedgerModification);
ledgerSchema.pew('remove', preventLedgerModification);
ledgerSchema.pew('updateMany', preventLedgerModification);
ledgerSchema.pew('findOneAndDelete', preventLedgerModification);
ledgerSchema.pew('findOneAndReplace', preventLedgerModification);
ledgerSchema.pew('deleteMany', preventLedgerModification);

const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports = ledgerModel;