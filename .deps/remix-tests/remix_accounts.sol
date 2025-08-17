// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

library TestsAccounts {
    function getAccount(uint index) pure public returns (address) {
        address[15] memory accounts;
		accounts[0] = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

		accounts[1] = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

		accounts[2] = 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db;

		accounts[3] = 0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB;

		accounts[4] = 0x617F2E2fD72FD9D5503197092aC168c91465E7f2;

		accounts[5] = 0x17F6AD8Ef982297579C203069C1DbfFE4348c372;

		accounts[6] = 0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678;

		accounts[7] = 0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7;

		accounts[8] = 0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C;

		accounts[9] = 0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC;

		accounts[10] = 0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c;

		accounts[11] = 0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C;

		accounts[12] = 0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB;

		accounts[13] = 0x583031D1113aD414F02576BD6afaBfb302140225;

		accounts[14] = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148;
return accounts[index];
    }
}
