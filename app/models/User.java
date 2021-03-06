package models;

import play.data.format.Formats;
import play.data.validation.Constraints;
import play.db.jpa.JPA;

import javax.persistence.*;
import java.util.Date;

import utils.Hash;

@Entity
@Table(name = "users")
public class User {

  @Id
  @Column(name = "user_id")
  @Formats.NonEmpty
  @GeneratedValue(strategy=GenerationType.AUTO)
  public Long id;

  @Column(name = "email_id", unique = true)
  @Constraints.Required
  @Formats.NonEmpty
  public String email;

  @Column(name = "password_hash")
  @Constraints.Required
  @Formats.NonEmpty
  public String passwordHash;

  @Column(name = "first_name")
  @Constraints.Required
  @Formats.NonEmpty
  public String firstName;

  @Column(name = "last_name")
  @Constraints.Required
  @Formats.NonEmpty
  public String lastName;

  @Column(name = "confirmation_token")
  public String confirmationToken;

  @Column(name = "date_creation")
  @Formats.DateTime(pattern = "yyyy-MM-dd HH:mm:ss")
  public Date dateCreation;

  @Column(name = "validated")
  @Formats.NonEmpty
  public Boolean validated = false;

  @Column(name = "status")
  @Formats.NonEmpty
  public String status;

  public static User authenticate(String email, String password) {
    //return find.where().eq("email", email).eq("password", password).findUnique();

    Query q = JPA.em().createQuery("SELECT u FROM User u WHERE u.email = :email");
    q.setParameter("email", email);
    try{
      User user = (User) q.getSingleResult();
      if(user != null) {
        if (Hash.checkPassword(password, user.passwordHash)) {
          return user;
        }
      }
      return null;
    } catch(Exception e){
      System.out.println("Exception e = " + e.getMessage());
      return null;
    }
  }

  /**
   * Find user by confirmationToken
   */
  public static User findByConfirmationToken(String confirmationToken) {
    Query q = JPA.em().createQuery("SELECT u FROM User u WHERE u.confirmationToken = :confirmationToken");
    q.setParameter("confirmationToken", confirmationToken);
    try{
      User user = (User) q.getSingleResult();
      if (user != null) {
        return user;
      }
    } catch(Exception e){
      System.out.println("Exception e = " + e.getMessage());
      return null;
    }
    return null;
  }

  /**
   * Find user by email
   */
  public static User findByEmail(String email) {
    Query q = JPA.em().createQuery("SELECT u FROM User u WHERE u.email = :email");
    q.setParameter("email", email);
    try{
      User user = (User) q.getSingleResult();
      if (user != null) {
        return user;
      }
    } catch(Exception e){
      System.out.println("Exception e = " + e.getMessage());
      return null;
    }
    return null;
  }

  /**
   * Confirms an account.
   *
   * @return true if confirmed, false otherwise.
   * @throws Exception
   */
  public static boolean confirm(User user) throws Exception {
    if (user == null) {
      return false;
    }

    user.confirmationToken = null;
    user.validated = true;
    JPA.em().persist(user);
    return true;
  }

}
