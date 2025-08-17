// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.9.0;

library Assert {

  event AssertionEvent(
    bool passed,
    string message,
    string methodName
  );

  event AssertionEventUint(
    bool passed,
    string message,
    string methodName,
    uint256 returned,
    uint256 expected
  );

  event AssertionEventInt(
    bool passed,
    string message,
    string methodName,
    int256 returned,
    int256 expected
  );

  event AssertionEventBool(
    bool passed,
    string message,
    string methodName,
    bool returned,
    bool expected
  );

  event AssertionEventAddress(
    bool passed,
    string message,
    string methodName,
    address returned,
    address expected
  );

  event AssertionEventBytes32(
    bool passed,
    string message,
    string methodName,
    bytes32 returned,
    bytes32 expected
  );

  event AssertionEventString(
    bool passed,
    string message,
    string methodName,
    string returned,
    string expected
  );

  event AssertionEventUintInt(
    bool passed,
    string message,
    string methodName,
    uint256 returned,
    int256 expected
  );

  event AssertionEventIntUint(
    bool passed,
    string message,
    string methodName,
    int256 returned,
    uint256 expected
  );

  function ok(bool a, string memory message) public returns (bool result) {
    result = a;
    emit AssertionEvent(result, message, "ok");
  }

  function equal(uint256 a, uint256 b, string memory message) public returns (bool result) {
    result = (a == b);
    emit AssertionEventUint(result, message, "equal", a, b);
  }

  function equal(int256 a, int256 b, string memory message) public returns (bool result) {
    result = (a == b);
    emit AssertionEventInt(result, message, "equal", a, b);
  }

  function equal(bool a, bool b, string memory message) public returns (bool result) {
    result = (a == b);
    emit AssertionEventBool(result, message, "equal", a, b);
  }

  // TODO: only for certain versions of solc
  //function equal(fixed a, fixed b, string message) public returns (bool result) {
  //  result = (a == b);
  //  emit AssertionEvent(result, message);
  //}

  // TODO: only for certain versions of solc
  //function equal(ufixed a, ufixed b, string message) public returns (bool result) {
  //  result = (a == b);
  //  emit AssertionEvent(result, message);
  //}

  function equal(address a, address b, string memory message) public returns (bool result) {
    result = (a == b);
    emit AssertionEventAddress(result, message, "equal", a, b);
  }

  function equal(bytes32 a, bytes32 b, string memory message) public returns (bool result) {
    result = (a == b);
    emit AssertionEventBytes32(result, message, "equal", a, b);
  }

  function equal(string memory a, string memory b, string memory message) public returns (bool result) {
     result = (keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b)));
     emit AssertionEventString(result, message, "equal", a, b);
  }

  function notEqual(uint256 a, uint256 b, string memory message) public returns (bool result) {
    result = (a != b);
    emit AssertionEventUint(result, message, "notEqual", a, b);
  }

  function notEqual(int256 a, int256 b, string memory message) public returns (bool result) {
    result = (a != b);
    emit AssertionEventInt(result, message, "notEqual", a, b);
  }

  function notEqual(bool a, bool b, string memory message) public returns (bool result) {
    result = (a != b);
    emit AssertionEventBool(result, message, "notEqual", a, b);
  }

  // TODO: only for certain versions of solc
  //function notEqual(fixed a, fixed b, string message) public returns (bool result) {
  //  result = (a != b);
  //  emit AssertionEvent(result, message);
  //}

  // TODO: only for certain versions of solc
  //function notEqual(ufixed a, ufixed b, string message) public returns (bool result) {
  //  result = (a != b);
  //  emit AssertionEvent(result, message);
  //}

  function notEqual(address a, address b, string memory message) public returns (bool result) {
    result = (a != b);
    emit AssertionEventAddress(result, message, "notEqual", a, b);
  }

  function notEqual(bytes32 a, bytes32 b, string memory message) public returns (bool result) {
    result = (a != b);
    emit AssertionEventBytes32(result, message, "notEqual", a, b);
  }

  function notEqual(string memory a, string memory b, string memory message) public returns (bool result) {
    result = (keccak256(abi.encodePacked(a)) != keccak256(abi.encodePacked(b)));
    emit AssertionEventString(result, message, "notEqual", a, b);
  }

  /*----------------- Greater than --------------------*/
  function greaterThan(uint256 a, uint256 b, string memory message) public returns (bool result) {
    result = (a > b);
    emit AssertionEventUint(result, message, "greaterThan", a, b);
  }

  function greaterThan(int256 a, int256 b, string memory message) public returns (bool result) {
    result = (a > b);
    emit AssertionEventInt(result, message, "greaterThan", a, b);
  }
  // TODO: safely compare between uint and int
  function greaterThan(uint256 a, int256 b, string memory message) public returns (bool result) {
    if(b < int(0)) {
      // int is negative uint "a" always greater
      result = true;
    } else {
      result = (a > uint(b));
    }
    emit AssertionEventUintInt(result, message, "greaterThan", a, b);
  }
  function greaterThan(int256 a, uint256 b, string memory message) public returns (bool result) {
    if(a < int(0)) {
      // int is negative uint "b" always greater
      result = false;
    } else {
      result = (uint(a) > b);
    }
    emit AssertionEventIntUint(result, message, "greaterThan", a, b);
  }
  /*----------------- Lesser than --------------------*/
  function lesserThan(uint256 a, uint256 b, string memory message) public returns (bool result) {
    result = (a < b);
    emit AssertionEventUint(result, message, "lesserThan", a, b);
  }

  function lesserThan(int256 a, int256 b, string memory message) public returns (bool result) {
    result = (a < b);
    emit AssertionEventInt(result, message, "lesserThan", a, b);
  }
  // TODO: safely compare between uint and int
  function lesserThan(uint256 a, int256 b, string memory message) public returns (bool result) {
    if(b < int(0)) {
      // int is negative int "b" always lesser
      result = false;
    } else {
      result = (a < uint(b));
    }
    emit AssertionEventUintInt(result, message, "lesserThan", a, b);
  }

  function lesserThan(int256 a, uint256 b, string memory message) public returns (bool result) {
    if(a < int(0)) {
      // int is negative int "a" always lesser
      result = true;
    } else {
      result = (uint(a) < b);
    }
    emit AssertionEventIntUint(result, message, "lesserThan", a, b);
  }
}
