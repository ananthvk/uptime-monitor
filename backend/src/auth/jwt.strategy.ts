import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${configService.getOrThrow("AUTH0_ISSUER_URL")}.well-known/jwks.json`
            }),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: `${configService.getOrThrow("AUTH0_AUDIENCE")}`,
            issuer: configService.getOrThrow("AUTH0_ISSUER_URL"),
            algorithms: ['RS256']
        })
    }
    validate(payload: any) {
        return { "user_id": payload.sub }
    }
}