# Double Zero

1. [Introduction](#introduction)
2. [The Challenge: Balancing Privacy and Interoperability](#the-challenge-balancing-privacy-and-interoperability)
   - [1. The Need for Privacy and Control](#1.1-the-need-for-privacy-and-control)
   - [2. The Desire for Interoperability and Resources](#1.2-the-desire-for-interoperability-and-resources)
   - [It's a challenge to achieve both](#its-a-challenge-to-achieve-both)
3. [Double Zero](#double-zero)
   - [Components](#components)
   - [Why Validium?](#why-validium)
   - [Proxy Implementation](#proxy-implementation-for-validium-rpc)

## Introduction

**Double Zero** is an initiative aimed at delivering private blockchain solutions that harness the power of ZKsync Elastic Chain ecosystem development tools and interoperability. By combining **Zero-Knowledge** with **Zero-Access**, it offers a unique value proposition for organizations interested in maintaining privacy and access management while leveraging the benefits of building with EVM-compatible technologies.

This project provides a near-turnkey solution for deploying a local **Validium chain with private RPC access**. It enables organizations to establish secure, private blockchain networks where transactions and data remain confidential and under strict access control. To showcase the access control features and the ability to adapt existing tools to this solution, a **private block explorer** is available for secure navigation through blockchain data.

## The Challenge: Balancing Privacy and Interoperability

Organizations seeking to adopt blockchain technology often face a significant dilemma.

### The Need for Privacy and Control

Entities such as banks, financial institutions, and corporations require **strict privacy and access management** over their transactions and data to comply with regulatory standards, protect sensitive information, and maintain competitive advantages. Public blockchains like Ethereum are inherently transparent, making them unsuitable for applications that demand confidentiality.

### The Desire for Interoperability and Resources

At the same time, these organizations want to leverage the **Interoperability** with existing blockchain networks, **Assets** available on public chains, and **Development tools** and robust ecosystems provided by ZKsync or Ethereum. This includes bridging assets, utilizing existing smart contracts and decentralized applications (dApps), and benefiting from an active developer community.

### It's a challenge to achieve both

There is a lack of blockchain solutions that offer both. Existing options often force organizations to choose between:

- **Private Blockchains**: Offer necessary privacy and access control but are isolated, lacking interoperability with public networks. This limits asset liquidity and the ability to leverage existing tools and dApps.
- **Public Blockchains**: Provide interoperability and access to a wide range of assets and tools but do not offer the privacy and granular access control required by organizations handling sensitive data.

**This trade-off creates a barrier** for organizations that need a **hybrid solution** combining the benefits of both private and public blockchains.

<h1 align="center">Double Zero</h1>

By addressing the need for both privacy and interoperability, double zero provides organizations with the **best of both worlds**: the ability to operate within a secure, private, and controlled blockchain environment while still engaging and leveraging the tools of the broader Ethereum/Elastic-Chain ecosystem.

### 1. High Privacy and Access Control

Deploying private Validium chains with **zero-knowledge proofs** ensures that transaction data remains confidential. Implementing **zero-access** through sophisticated authorization and permission management allows for granular control over who can access specific data or interact with smart contracts specific functions.

### 2. Ease of Deployment with ZK Stack and Seamless Elastic-Chain/Ethereum Interoperability
Offering a near-turnkey solution via **ZK Stack technology** simplifies the process of aetting up the Validium chain, customizing features to meet specific needs and reducing technical barriers and deployment time. Maintaining a connection to the Elastic-Chain/Etherem settlement layer enables organizations to **Bridge assets** between private and public chains, utilize **public smart contracts and dApps**, and leverage existing **development tools** and **resources**.

## Components

The project can be divided into three main components. In the sections below we will cover some details reagarding the reason behind this choices and their implication:

### [Validium Chain Deployment](#why-validium)

Setting up a secure and scalable blockchain environment that ensures:

- Complete data privacy and confidentiality.
- High transaction throughput.
- Scalability without compromising security.

### [Authorization and Permission Management](#why-the-proxy-is-necessary)

Implementing a proxy that allow administrators to:

- Define granular user permissions.
- Control data access and smart contract interactions.
- Enforce organizational policies and compliance requirements.

### Private Block Explorer Development

Creating a customized block explorer that:

- **Requires user authentication** (log-in).
- Enforces **permission-based data access**.
- Provides a user-friendly interface for navigating blockchain data securely.

## Why Validium?

Selecting the appropriate Layer 2 solution is essential for achieving our objectives of privacy, scalability, control, customizability, and interoperability. Validium strategic choice empowers entities like banks, financial institutions, and corporations to harness blockchain technology effectively without compromising on security or functionality. Validium blockchains address the critical need for a hybrid solution that merges the benefits of private and public blockchains, enabling organizations to operate within a secure, private, and controlled environment while still engaging with the broader Ethereum ecosystem.

### Privacy Aspects

Validium provides enhanced privacy by storing transaction data off-chain, ensuring that sensitive information remains confidential and inaccessible to unauthorized parties. Organizations have full authority over who can access the data, aligning with the Zero-Access principle central to Double Zero.

On the Layer 1 (L1) blockchain, only minimal data is posted—specifically, cryptographic commitments like state roots and zero-knowledge proofs (ZK-Proofs). These proofs validate the correctness of off-chain transactions without revealing any transaction details, maintaining privacy while ensuring security. Since transaction data is not stored on-chain, it is impossible to reconstruct the Validium chain’s transaction history from L1 data alone, thereby enhancing privacy and safeguarding sensitive information.

### Scalability

Validium excels in scalability by handling thousands of transactions per second, significantly surpassing the capacity of Layer 1 and many other Layer 2 solutions. By keeping data off-chain, Validium reduces the computational and storage burden on the Ethereum network, leading to faster transaction processing and confirmation times. This approach also lowers gas costs, making transactions more cost-effective for users. The efficient resource utilization enables the network to scale seamlessly without compromising performance, making it ideal for enterprise-grade applications that demand high throughput.

### Sequencer/Prover Control

A critical aspect of Validium is the control it grants over the sequencer and prover components. Organizations can operate their own sequencers and provers, giving them full control over transaction ordering and proof generation. This operational autonomy allows for customized consensus mechanisms and security models tailored to specific organizational requirements. By reducing reliance on external parties, organizations enhance security and minimize trust assumptions, which is crucial for applications handling sensitive or proprietary data.

### Customizability

Validium offers a high degree of customizability, enabling organizations to implement permissioned access and role-based controls. Network parameters such as block times, gas limits, and fee structures can be adjusted to optimize performance and user experience.  Its modular architecture means that components can be customized or replaced as needed, providing tailored solutions that fit specific use cases and industry requirements.

### Interoperability with Ethereum

Interoperability is a significant advantage of Validium, as it facilitates seamless integration with the Ethereum ecosystem. Organizations can bridge assets between the Validium chain and Ethereum, leveraging Ethereum’s liquidity and the extensive array of decentralized applications (dApps). Validium’s EVM compatibility ensures that smart contracts and dApps can operate across both networks, facilitating cross-chain communication and expanding the network’s reach. Developers benefit from the ability to use familiar Ethereum tools and frameworks which reduces the learning curve and accelerates development timelines.

## Proxy Implementation for Validium RPC

Implementing a proxy layer on top of the Validium RPC interface is a strategic decision to enhance security, access control, and usability. Given that our audience includes individuals familiar with traditional web technologies (web2), we have designed the proxy to be configurable via a `YAML file`. 

### Why the Proxy is Necessary

1. **Enforcing Zero-Access Principles:** The proxy acts as a gatekeeper, enforcing strict access controls in line with the Zero-Access principle of Double Zero. It ensures that only authenticated and authorized users can interact with the Validium chain.
2. **Authentication and Authorization:** Direct exposure of the Validium RPC can pose security risks. A proxy allows for the implementation of robust authentication (e.g., API keys, OAuth) and authorization mechanisms to verify user identities and permissions before granting access. The proxy mitigates security threats such as DDoS attacks and unauthorized access by filtering and validating incoming requests.

### YAML-Based Permission Configuration

To cater to a web2 audience and simplify the permission management process, we utilize a `YAML file` to define access controls

#### Permissions & Groups

Permissions are organized into groups, each associated with specific access rights.	
- Groups: Logical collections of users or accounts that share the same permissions
- Permissions: Define what contracts or methods a group can access.

#### Group Definitions

Groups can be defined using:

***1. List of Accounts:*** Explicitly specify account addresses (wallet addresses) that belong to a group.
```
groups:
  groupA:
    accounts:
      - '0xAccountAddress1'
      - '0xAccountAddress2'
  groupB:
    accounts:
      - '0xAccountAddress3'
```
***2.List of NFTs:*** Define group membership based on ownership of specific NFTs. Any account holding the NFT at the time is considered part of the group.
```
  groupC:
    nfts:
      - '0xNFTContractAddress1'
      - '0xNFTContractAddress2'
```
#### Contract and Method Permissions

Define what each group can access:

***1. Contracts:*** Specify which smart contracts a group can interact with.
```
permissions:
  groupA:
    contracts:
      - '0xContractAddress1'
      - '0xContractAddress2'
  groupB:
    contracts:
      - '0xContractAddress3'
```
***2. Methods:*** Restrict access to specific methods within contracts.  
```
groupC:
    contracts:
      - '0xContractAddress4'
    methods:
      - 'transfer'
      - 'approve'
```
