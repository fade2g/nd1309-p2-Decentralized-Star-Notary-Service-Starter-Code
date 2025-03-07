const StarNotary = artifacts.require("StarNotary");

contract('StarNotary', function (accounts) {
    const owner = accounts[0];

    it('can Create a Star', async () => {
        let tokenId = 1;
        let instance = await StarNotary.deployed();
        await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
        assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
    });

    it('lets user1 put up their star for sale', async () => {
        let instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let starId = 2;
        let starPrice = web3.utils.toWei(".01", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        assert.equal(await instance.starsForSale.call(starId), starPrice);
    });

   it('lets user1 get the funds after the sale', async () => {
        let instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = 3;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
        await instance.buyStar(starId, {from: user2, value: balance});
        let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
        let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
        let value2 = Number(balanceOfUser1AfterTransaction);
        assert.equal(value1, value2);
    });

    it('lets user2 buy a star, if it is put up for sale', async () => {
        let instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = 4;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
        await instance.buyStar(starId, {from: user2, value: balance});
        assert.equal(await instance.ownerOf.call(starId), user2);
    });

    it('lets user2 buy a star and decreases its balance in ether', async () => {
        let instance = await StarNotary.deployed();
        let user1 = accounts[1];
        let user2 = accounts[2];
        let starId = 5;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        await instance.putStarUpForSale(starId, starPrice, {from: user1});
        let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
        const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
        await instance.buyStar(starId, {from: user2, value: balance, gasPrice: 0});
        const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
        let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
        assert.equal(value, starPrice);
    });

// Implement Task 2 Add supporting unit tests

    it('can add the star name and star symbol properly', async () => {
        // 1. create a Star with different tokenId
        // 2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
        const instance = await StarNotary.deployed();
        const user1 = accounts[1];
        const starId = 6;
        let starPrice = web3.utils.toWei(".01", "ether");
        let balance = web3.utils.toWei(".05", "ether");
        await instance.createStar('awesome star', starId, {from: user1});
        assert.equal(await instance.symbol.call(), 'SNT');
        assert.equal(await instance.name.call(), 'StarNotaryToken');
    });

    it('lets 2 users exchange stars', async () => {
        // 1. create 2 Stars with different tokenId
        // 2. Call the exchangeStars functions implemented in the Smart Contract
        // 3. Verify that the owners changed
        const instance = await StarNotary.deployed();
        const user1 = accounts[1];
        const user2 = accounts[2];
        const starId1 = 71;
        const starName1 = `test star with id ${starId1}`
        const starId2 = 72;
        const starName2 = `test star with id ${starId2}`
        await instance.createStar(starName1, starId1, {from: user1});
        await instance.createStar(starName2, starId2, {from: user2});
        // baseline after minting, before transfer
        assert.equal(await instance.ownerOf(starId1), user1, 'star 1 is owned by account 1');
        assert.equal(await instance.ownerOf(starId2), user2, 'star 2 is owned by account 2');
        await instance.exchangeStars(starId1, starId2, {from: user1});
        // assert after exchange/swapping of tokens
        assert.equal(await instance.ownerOf(starId1), user2, 'star 1 is now owned by account 2');
        assert.equal(await instance.ownerOf(starId2), user1, 'star 2 is now owned by account 1');
    });

    it('lets a user transfer a star', async () => {
        // 1. create a Star with different tokenId
        // 2. use the transferStar function implemented in the Smart Contract
        // 3. Verify the star owner changed.
        const instance = await StarNotary.deployed();
        const user1 = accounts[1];
        const user2 = accounts[2];
        const starId = 8;
        const starName = `test star with id ${starId}`
        await instance.createStar(starName, starId, {from: user1});
        // baseline after minting, before transfer
        assert.equal(await instance.ownerOf(starId), user1, 'star is owned by account 1');
        await instance.transferStar(user2, starId, {from: user1});
        // assert after exchange/swapping of tokens
        assert.equal(await instance.ownerOf(starId), user2, 'star is now owned by account 2');
    });

    it('lookUptokenIdToStarInfo test', async () => {
        // 1. create a Star with different tokenId
        // 2. Call your method lookUptokenIdToStarInfo
        // 3. Verify if you Star name is the same
        const instance = await StarNotary.deployed();
        const user1 = accounts[1];
        const starId = 9;
        const starName = `test star with id ${starId}`;
        await instance.createStar(starName, starId, {from: user1});
        const star = await instance.lookUptokenIdToStarInfo.call(starId);
        assert.equal(star, starName);
    });
});