const jwt = require( 'jsonwebtoken' );
const jwkToPem = require( 'jwk-to-pem' );
const EC = require( 'elliptic' ).ec;
const ec = new EC( 'p521' );
const crypto = require( 'crypto' );
// Generating JWT
exports.generateToken = async ( req, res, next ) =>
{

    // Generate a new key pair using random seed

    const seed = process.env.SEED
    const keyPair = ec.keyFromPrivate( seed );

    // Extract public and private key components
    const privateKey = keyPair.getPrivate( 'hex' );
    const publicKey = keyPair.getPublic();
    const jwk = {
        kty: 'EC',
        crv: 'P-521',
        x: publicKey.getX().toArrayLike( Buffer ).toString( 'base64' ),
        y: publicKey.getY().toArrayLike( Buffer ).toString( 'base64' ),
        d: Buffer.from( privateKey, 'hex' ).toString( 'base64' ),
    };

    const pem = jwkToPem( jwk, { private: true } );

    let data = {
        time: new Date().getTime(),
        userId: 12,
    }
    const token = jwt.sign( data, pem, {
        algorithm: "ES512",
        expiresIn: '1day'
    } );

    res.send( { "token": token } );
};

// Verification of JWT
exports.validateToken = async ( token ) =>
{
    // Tokens are generally passed in header of request
    // Due to security reasons.
    const seed = process.env.SEED
    const keyPair = ec.keyFromPrivate( seed );

    // Extract public and private key components
    const privateKey = keyPair.getPrivate( 'hex' );
    const publicKey = keyPair.getPublic();
    const jwk = {
        kty: 'EC',
        crv: 'P-521',
        x: publicKey.getX().toArrayLike( Buffer ).toString( 'base64' ),
        y: publicKey.getY().toArrayLike( Buffer ).toString( 'base64' ),
        d: Buffer.from( privateKey, 'hex' ).toString( 'base64' ),
    };

    const pem = jwkToPem( jwk, { private: true } );

    try
    {
        const verified = jwt.verify( token, pem );
        if ( verified )
        {
            return true;
        } else
        {
            // Access Denied
            return false;
        }
    } catch ( error )
    {
        // Access Denied
        return false;
    }
} 