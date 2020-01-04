const Store = artifacts.require("Store"); 

contract("Store Contract", (accounts) => {

    let store;
    const name = "Original Store";
    const description = "original description";
    const owner = accounts[0];
    const secondAccount = accounts[1];
    const beneficiary = accounts[2];

    beforeEach(async () => {
        store = await Store.new(beneficiary, name, description);
    })

    describe("initialize contract", () => {

        it("Test the owner address", async () =>{
            const actualOwner = await store.storeOwner();
            assert.equal(actualOwner, owner, "Owner account should match actual owner account");
        });

        it("Test the store's description", async () =>{
            const actualDescription = await store.description();
            assert.equal(description, actualDescription, "Stores's description should match actual description")
        });

        it(" Test beneficiary account", async () => {
            const actualBeneficiary = await store.beneficiary();
            assert.equal(actualBeneficiary, beneficiary, "Beneficiary address should match")
        });

        it("Tests for isOpen", async () => {
            const opened = await store.isOpen();
            assert.equal(opened,true, "Shop must be opened after contract is initialized");
        })
    })

    describe("addProduct()", async () => {
        
        const productDesc = "My number 1 product";
        const quantity = 10;
        const price = 20;

        beforeEach( async () =>{
            await store.addProduct(productDesc, price, quantity, {from: owner});
        })

        describe("Tests access controls", () => {

            it("Throws an error for non owner account", async ()=>{
                try {
                    await store.addProduct(productDesc, quantity, price, {from: accounts[2]})
                    assert.fail("addProduct is retricted to only owner");
                } catch (err) {
                    const expectedError = "Ownable: caller is not the owner";
                    const reason = err.reason;
                    assert.equal(expectedError, reason, "Reason must match expected error");
                }
            })
        })

        it("increases product count", async () => {
            const productCount = await store.productCount({from:owner});
            assert.equal(1, productCount, "product count must be 1");
        });

        it("Tests for product description", async () => {
            const product = await store.products(0);
            assert.equal(product.description, productDesc, "product descriptions should be same");
        });

        it("Tests for product quantity", async () =>{
            const product = await store.products(0);
            assert.equal(product.quantity, quantity, "Qunatity must be equal to 10");
        })

        it("Tests for product price", async () => {
            const product = await store.products(0, {from: owner})
            assert.equal(product.price, price, "product price must be equal to 20");
        });

        it("Emits ProductAdded event", async () => {
            const tx = await store.addProduct(productDesc, price, quantity,{from: owner})
            const expectedEvent = "ProductAdded";
            const eventLogged = tx.logs[0].event;
            assert.equal(eventLogged, expectedEvent, `Event must match ${expectedEvent}`);
        })
    });

    describe("updateProductPrice()", () => {

        const productDesc = "My number 1 product";
        const quantity = 10;
        const price = 20;
        const newPrice = 30;

        beforeEach( async () =>{
            await store.addProduct(productDesc, price, quantity, {from: owner});
        });

        describe("Tests access controls", () => {

            it("Throws an error for non owner account", async ()=>{
                try {
                    await store.updateProductPrice(0, newPrice, {from: accounts[2]})
                    assert.fail("addProduct is retricted to only owner");
                } catch (err) {
                    const expectedError = "Ownable: caller is not the owner";
                    const reason = err.reason;
                    assert.equal(expectedError, reason, "Reason must match expected error");
                }
            })
        })

        it("Sets product new price", async () => {
            const product = await store.products(0);
            assert.equal(product.price, price, "Product price must be equal to 20")
            await store.updateProductPrice(0, newPrice, {from: owner});
            const productUpdated = await store.products(0);
            assert.equal(productUpdated.price, newPrice, "Product price must be equa to 30");
        }); 
    })
        //FUNCTIONS TESTING


        // getProduct()
        // buyProduct()
        // auctionProduct()
        // bid()
        // withdrawBalance()
        // getStoreAddress()
})