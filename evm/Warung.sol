// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================
// INTERFACES & ABSTRACT CONTRACTS
// ============================================

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface IOracleHub {
    function getTokenEquivalent(address _token, uint256 _rupiahAmount) external view returns (uint256);
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        _transferOwnership(_msgSender());
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// ============================================
// MOCK USDT (UNTUK TESTING DI REMIX)
// ============================================

contract MockUSDT is IERC20 {
    string public name = "Mock USDT";
    string public symbol = "USDT";
    uint8 public decimals = 6;
    uint256 private _totalSupply;
    
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    constructor() {
        // Mint 1 million USDT untuk testing
        _totalSupply = 1000000 * 10**decimals;
        _balances[msg.sender] = _totalSupply;
    }
    
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) external view override returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(_balances[from] >= amount, "Insufficient balance");
        
        _balances[from] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "Approve from zero address");
        require(spender != address(0), "Approve to zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function _spendAllowance(address owner, address spender, uint256 amount) internal {
        uint256 currentAllowance = _allowances[owner][spender];
        require(currentAllowance >= amount, "Insufficient allowance");
        _approve(owner, spender, currentAllowance - amount);
    }
    
    // Helper untuk testing: mint USDT ke address
    function mint(address to, uint256 amount) external {
        _balances[to] += amount;
        _totalSupply += amount;
        emit Transfer(address(0), to, amount);
    }
}

// ============================================
// SIMPLE ORACLE HUB
// ============================================

contract SimpleOracleHub is Ownable {
    
    address public constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    
    mapping(address => uint256) public tokenToRupiahRate;
    mapping(address => bool) public authorizedUpdater;
    
    event RateUpdated(address indexed token, uint256 newRate, uint256 timestamp);
    event UpdaterStatusChanged(address indexed updater, bool status);
    
    constructor() {
        // Default: 1 USDT = 15,800 IDR (dalam wei)
        // Rate = 15800 * 1e18
        
        // Set owner as authorized updater
        authorizedUpdater[msg.sender] = true;
    }
    
    function getTokenEquivalent(
        address _token,
        uint256 _rupiahAmount
    ) external view returns (uint256) {
        uint256 rate = tokenToRupiahRate[_token];
        require(rate > 0, "Rate not set for this token");
        
        // For USDT (6 decimals): rupiahAmount (18 dec) / rate (18 dec) * 1e6
        uint8 tokenDecimals = _getTokenDecimals(_token);
        
        return (_rupiahAmount * (10 ** tokenDecimals)) / rate;
    }
    
    function getRupiahEquivalent(
        address _token,
        uint256 _tokenAmount
    ) external view returns (uint256) {
        uint256 rate = tokenToRupiahRate[_token];
        require(rate > 0, "Rate not set for this token");
        
        uint8 tokenDecimals = _getTokenDecimals(_token);
        
        return (_tokenAmount * rate) / (10 ** tokenDecimals);
    }
    
    function updateRate(address _token, uint256 _newRate) external {
        require(
            authorizedUpdater[msg.sender] || msg.sender == owner(),
            "Not authorized"
        );
        require(_newRate > 0, "Rate must be greater than 0");
        
        tokenToRupiahRate[_token] = _newRate;
        emit RateUpdated(_token, _newRate, block.timestamp);
    }
    
    function setAuthorizedUpdater(address _updater, bool _status) external onlyOwner {
        authorizedUpdater[_updater] = _status;
        emit UpdaterStatusChanged(_updater, _status);
    }
    
    function getRate(address _token) external view returns (uint256) {
        return tokenToRupiahRate[_token];
    }
    
    function _getTokenDecimals(address _token) internal pure returns (uint8) {
        if (_token == NATIVE) return 18;
        return 6; // Assume USDT/USDC
    }
}

// ============================================
// UMKM QR PAYMENT
// ============================================

contract UMKMQRPayment is Ownable {
    
    address public constant NATIVE = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    address private constant ZERO_ADDRESS = address(0);
    
    IOracleHub public immutable ORACLE_HUB;
    
    struct OrderData {
        string orderId;
        string referenceString;
        address tokenAddress;
        address creator;
    }
    
    struct PaymentAmounts {
        address tokenAddress;
        uint256 tokenAmountTotal;
        uint256 rupiahAmountTotal;
        uint256 tokenAmountIssued;
    }
    
    mapping(bytes32 => PaymentAmounts) public paymentsFromOrder;
    mapping(address => bool) public friendlyBot;
    
    event PaymentCreated(
        address indexed creator,
        string orderId,
        address indexed tokenAddress,
        uint256 rupiahAmount,
        bytes32 indexed orderDataHash
    );
    
    event PaymentReceived(
        address indexed payer,
        string orderId,
        string referenceString,
        address indexed tokenAddress,
        uint256 tokenAmount,
        uint256 rupiahAmount,
        bytes32 indexed orderDataHash
    );
    
    event OrderSettled(
        address indexed beneficiary,
        address indexed tokenAddress,
        uint256 tokenAmount,
        uint256 rupiahAmount,
        bytes32 orderDataHash
    );
    
    constructor(address _oracleHubAddress) {
        ORACLE_HUB = IOracleHub(_oracleHubAddress);
        friendlyBot[msg.sender] = true; // Owner sebagai bot default
    }
    
    function getOrderHash(OrderData memory _orderData) public pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                _orderData.orderId,
                _orderData.referenceString,
                _orderData.tokenAddress,
                _orderData.creator
            )
        );
    }
    
    function changeBotStatus(address _botAddress, bool _status) external onlyOwner {
        friendlyBot[_botAddress] = _status;
    }
    
    // Customer bayar dengan USDT/USDC
    function payQR(
        address _token,
        uint256 _rupiahAmount,
        string memory _orderId,
        string memory _referenceString
    ) external {
        uint256 tokenAmount = _payQR(_token, _rupiahAmount, _orderId, _referenceString);
        
        IERC20(_token).transferFrom(msg.sender, address(this), tokenAmount);
    }
    
    function _payQR(
        address _token,
        uint256 _rupiahAmount,
        string memory _orderId,
        string memory _referenceString
    ) internal returns (uint256 tokenAmount) {
        OrderData memory orderData = OrderData({
            orderId: _orderId,
            referenceString: _referenceString,
            tokenAddress: _token,
            creator: msg.sender
        });
        
        bytes32 orderDataHash = getOrderHash(orderData);
        PaymentAmounts storage payment = paymentsFromOrder[orderDataHash];
        
        tokenAmount = ORACLE_HUB.getTokenEquivalent(_token, _rupiahAmount);
        
        payment.tokenAddress = _token;
        payment.tokenAmountTotal += tokenAmount;
        payment.rupiahAmountTotal += _rupiahAmount;
        
        emit PaymentReceived(
            msg.sender,
            _orderId,
            _referenceString,
            _token,
            tokenAmount,
            _rupiahAmount,
            orderDataHash
        );
    }
    
    // Customer bayar dengan native (ETH/MATIC)
    function payQRNative(
        string memory _orderId,
        string memory _referenceString,
        uint256 _rupiahAmount
    ) external payable {
        uint256 actualTokenAmount = ORACLE_HUB.getTokenEquivalent(NATIVE, _rupiahAmount);
        
        require(msg.value >= actualTokenAmount, "Insufficient funds");
        
        _payQR(NATIVE, _rupiahAmount, _orderId, _referenceString);
        
        if (msg.value > actualTokenAmount) {
            payable(msg.sender).transfer(msg.value - actualTokenAmount);
        }
    }
    
    // Settle untuk ERC20
    function settleQROrder(address _beneficiary, bytes32 _orderDataHash) external {
        require(friendlyBot[msg.sender], "Only friendly bot");
        _settleQROrder(_beneficiary, _orderDataHash, false);
    }
    
    // Settle untuk native
    function settleQROrderNative(address _beneficiary, bytes32 _orderDataHash) external {
        require(friendlyBot[msg.sender], "Only friendly bot");
        _settleQROrder(_beneficiary, _orderDataHash, true);
    }
    
    function _settleQROrder(
        address _beneficiary,
        bytes32 _orderDataHash,
        bool _isNative
    ) internal {
        PaymentAmounts storage payment = paymentsFromOrder[_orderDataHash];
        
        require(payment.tokenAddress != ZERO_ADDRESS, "Order does not exist");
        
        bool tokenMatches = _isNative 
            ? payment.tokenAddress == NATIVE
            : payment.tokenAddress != NATIVE;
            
        require(tokenMatches, "Token mismatch");
        require(payment.tokenAmountIssued < payment.tokenAmountTotal, "Already paid in full");
        
        uint256 tokenAmountToIssue = payment.tokenAmountTotal - payment.tokenAmountIssued;
        payment.tokenAmountIssued += tokenAmountToIssue;
        
        emit OrderSettled(
            _beneficiary,
            payment.tokenAddress,
            tokenAmountToIssue,
            payment.rupiahAmountTotal,
            _orderDataHash
        );
        
        if (_isNative) {
            payable(_beneficiary).transfer(tokenAmountToIssue);
        } else {
            IERC20(payment.tokenAddress).transfer(_beneficiary, tokenAmountToIssue);
        }
    }
    
    function getPaymentInfo(bytes32 _orderHash) external view returns (PaymentAmounts memory) {
        return paymentsFromOrder[_orderHash];
    }
    
    receive() external payable {}
}

// ============================================
// UMKM REGISTRY
// ============================================

contract UMKMRegistry is Ownable {
    
    struct UMKM {
        string businessName;
        string businessType;
        address walletAddress;
        uint256 registeredAt;
        uint256 totalOrders;
        uint256 totalRevenue;
        bool isActive;
    }
    
    mapping(address => UMKM) public umkms;
    mapping(address => bytes32[]) public umkmOrders;
    address[] public allUMKMs;
    
    event UMKMRegistered(
        address indexed umkmAddress,
        string businessName,
        string businessType,
        uint256 timestamp
    );
    
    event OrderRecorded(
        address indexed umkmAddress,
        bytes32 indexed orderHash,
        uint256 rupiahAmount,
        uint256 timestamp
    );
    
    function registerUMKM(string memory _businessName, string memory _businessType) external {
        require(!umkms[msg.sender].isActive, "Already registered");
        require(bytes(_businessName).length > 0, "Business name required");
        
        umkms[msg.sender] = UMKM({
            businessName: _businessName,
            businessType: _businessType,
            walletAddress: msg.sender,
            registeredAt: block.timestamp,
            totalOrders: 0,
            totalRevenue: 0,
            isActive: true
        });
        
        allUMKMs.push(msg.sender);
        
        emit UMKMRegistered(msg.sender, _businessName, _businessType, block.timestamp);
    }
    
    function recordOrder(
        address _umkmAddress,
        bytes32 _orderHash,
        uint256 _rupiahAmount
    ) external {
        require(umkms[_umkmAddress].isActive, "UMKM not registered");
        
        umkms[_umkmAddress].totalOrders++;
        umkms[_umkmAddress].totalRevenue += _rupiahAmount;
        umkmOrders[_umkmAddress].push(_orderHash);
        
        emit OrderRecorded(_umkmAddress, _orderHash, _rupiahAmount, block.timestamp);
    }
    
    function getUMKM(address _umkmAddress) external view returns (UMKM memory) {
        return umkms[_umkmAddress];
    }
    
    function getUMKMOrders(address _umkmAddress) external view returns (bytes32[] memory) {
        return umkmOrders[_umkmAddress];
    }
    
    function getTotalUMKMs() external view returns (uint256) {
        return allUMKMs.length;
    }
}